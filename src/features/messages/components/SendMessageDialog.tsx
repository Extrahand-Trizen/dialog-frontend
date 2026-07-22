import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import {
  filterDevMockTemplates,
  getDevMockTemplateDetail,
} from '@/config/dev-mock-data';
import { getTemplate } from '@/features/templates/api/getTemplate';
import { listTemplates } from '@/features/templates/api/listTemplates';
import { templateKeys } from '@/features/templates/queryKeys';
import { usePhoneNumberOptions } from '@/hooks/use-phone-number-options';
import { useSendTemplateMessage } from '@/features/messages/hooks/useSendTemplateMessage';
import {
  extractVariableSlots,
  normalizePhoneDigits,
  parsePhoneNumberId,
  PHONE_DEFAULT_VALUE,
  sendMessageFormSchema,
  templateHasDynamicUrlButton,
  type SendMessageFormValues,
} from '@/features/messages/schemas/sendMessageSchema';
import type { TemplateSummaryDto } from '@/features/templates/types';

type SendMessageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_DEFAULTS: SendMessageFormValues = {
  to: '',
  templateId: '',
  phoneNumberId: PHONE_DEFAULT_VALUE,
  variables: {},
  buttonUrlSuffix: '',
};

const APPROVED_LIST_PARAMS = { page: 1, limit: 100, metaStatus: 'APPROVED' as const };

export function SendMessageDialog({ open, onOpenChange }: SendMessageDialogProps) {
  const useMockData = isDevMockAuthEnabled();
  const sendMutation = useSendTemplateMessage();
  const phonesQuery = usePhoneNumberOptions(open);

  const form = useForm<SendMessageFormValues>({
    resolver: zodResolver(sendMessageFormSchema),
    defaultValues: EMPTY_DEFAULTS,
  });

  const templateId = useWatch({ control: form.control, name: 'templateId' });

  useEffect(() => {
    if (!open) return;
    form.reset(EMPTY_DEFAULTS);
  }, [open, form]);

  const templatesQuery = useQuery({
    queryKey: templateKeys.list(APPROVED_LIST_PARAMS),
    queryFn: () =>
      useMockData
        ? Promise.resolve(filterDevMockTemplates(APPROVED_LIST_PARAMS))
        : listTemplates(APPROVED_LIST_PARAMS),
    enabled: open,
  });

  const templateDetailQuery = useQuery({
    queryKey: templateKeys.detail(templateId),
    queryFn: async () => {
      if (useMockData) {
        const detail = getDevMockTemplateDetail(templateId);
        if (!detail) {
          throw new Error('Template not found');
        }
        return detail;
      }
      return getTemplate({ templateId });
    },
    enabled: open && !!templateId,
  });

  const templateOptions: TemplateSummaryDto[] = templatesQuery.data?.items ?? [];

  const selectedTemplate = useMemo(
    () => templateOptions.find((item) => item.id === templateId),
    [templateId, templateOptions],
  );

  const variableSlots = useMemo(
    () => extractVariableSlots(templateDetailQuery.data?.currentVersionDetail?.variableSchema),
    [templateDetailQuery.data?.currentVersionDetail?.variableSchema],
  );

  const needsButtonUrlSuffix = useMemo(
    () => templateHasDynamicUrlButton(templateDetailQuery.data?.currentVersionDetail?.components),
    [templateDetailQuery.data?.currentVersionDetail?.components],
  );

  useEffect(() => {
    if (!templateId) return;
    const nextVariables: Record<string, string> = {};
    for (const slot of variableSlots) {
      nextVariables[slot.key] = '';
    }
    form.setValue('variables', nextVariables);
    form.setValue('buttonUrlSuffix', '');
  }, [templateId, variableSlots, form]);

  const isPending = sendMutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    if (!selectedTemplate) {
      form.setError('templateId', { message: 'Select an approved template' });
      return;
    }

    const filledVariables: Record<string, string> = {};
    for (const slot of variableSlots) {
      const value = values.variables[slot.key]?.trim() ?? '';
      if (!value) {
        form.setError(`variables.${slot.key}`, { message: `${slot.label} is required` });
        return;
      }
      filledVariables[slot.key] = value;
    }

    const buttonSuffix = values.buttonUrlSuffix?.trim() ?? '';
    if (needsButtonUrlSuffix && !buttonSuffix) {
      form.setError('buttonUrlSuffix', {
        message: 'Button link suffix is required (usually a task id)',
      });
      return;
    }
    if (buttonSuffix) {
      filledVariables.taskId = buttonSuffix;
    }

    if (useMockData) {
      onOpenChange(false);
      return;
    }

    await sendMutation.mutateAsync({
      template: selectedTemplate.metaTemplateName,
      language: selectedTemplate.language,
      to: normalizePhoneDigits(values.to),
      variables: Object.keys(filledVariables).length > 0 ? filledVariables : undefined,
      idempotencyKey: `ui-${crypto.randomUUID()}`,
      phoneNumberId: parsePhoneNumberId(values.phoneNumberId),
    });

    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send template message</DialogTitle>
          <DialogDescription>
            Send an approved WhatsApp template to a phone number (digits with country code).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient phone</FormLabel>
                  <FormControl>
                    <Input placeholder="919876543210" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormDescription>Country code + number, digits only preferred.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  {templatesQuery.isLoading ? (
                    <Skeleton className="h-10" />
                  ) : (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approved template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templateOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.metaTemplateName} ({option.language})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender phone (optional)</FormLabel>
                  {phonesQuery.isLoading ? (
                    <Skeleton className="h-10" />
                  ) : (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Use default phone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PHONE_DEFAULT_VALUE}>Default phone</SelectItem>
                        {phonesQuery.data?.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {templateId ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">Template variables</p>
                {templateDetailQuery.isLoading ? (
                  <Skeleton className="h-20" />
                ) : variableSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">This template has no body variables.</p>
                ) : (
                  variableSlots.map((slot) => (
                    <FormField
                      key={slot.key}
                      control={form.control}
                      name={`variables.${slot.key}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{slot.label}</FormLabel>
                          <FormControl>
                            <Input placeholder={slot.key} {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))
                )}
                {needsButtonUrlSuffix ? (
                  <FormField
                    control={form.control}
                    name="buttonUrlSuffix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button link suffix</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="task id (e.g. 665f…)"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormDescription>
                          {`Appended to the template URL button (open/tasks/…{{1}}).`}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
              </div>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || useMockData}>
                {isPending ? 'Sending…' : useMockData ? 'Connect backend to send' : 'Send message'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
