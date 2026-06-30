import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { usePhoneNumberOptions } from '@/hooks/use-phone-number-options';
import { useTemplateOptions } from '@/hooks/use-template-options';
import { useCreateNotificationRule } from '@/features/notification-rules/hooks/useCreateNotificationRule';
import { useUpdateNotificationRule } from '@/features/notification-rules/hooks/useUpdateNotificationRule';
import {
  notificationRuleFormSchema,
  parsePhoneNumberId,
  parseVariableMappingJson,
  PHONE_DEFAULT_VALUE,
  stringifyVariableMapping,
  type NotificationRuleFormValues,
} from '@/features/notification-rules/schemas';
import type { NotificationRuleDto } from '@/features/notification-rules/types';

type RuleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: NotificationRuleDto;
};

const EMPTY_DEFAULTS: NotificationRuleFormValues = {
  eventKey: '',
  name: '',
  templateId: '',
  phoneNumberId: PHONE_DEFAULT_VALUE,
  enabled: true,
  priority: 0,
  variableMappingJson: '',
};

export function RuleFormDialog({ open, onOpenChange, rule }: RuleFormDialogProps) {
  const isEdit = !!rule;
  const createMutation = useCreateNotificationRule();
  const updateMutation = useUpdateNotificationRule();
  const templatesQuery = useTemplateOptions(open);
  const phonesQuery = usePhoneNumberOptions(open);

  const form = useForm<NotificationRuleFormValues>({
    resolver: zodResolver(notificationRuleFormSchema),
    defaultValues: EMPTY_DEFAULTS,
  });

  useEffect(() => {
    if (!open) return;
    if (rule) {
      form.reset({
        eventKey: rule.eventKey,
        name: rule.name,
        templateId: rule.templateId,
        phoneNumberId: rule.phoneNumberId ?? PHONE_DEFAULT_VALUE,
        enabled: rule.enabled,
        priority: rule.priority,
        variableMappingJson: stringifyVariableMapping(rule.variableMapping),
      });
    } else {
      form.reset(EMPTY_DEFAULTS);
    }
  }, [open, rule, form]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    const variableMapping = parseVariableMappingJson(values.variableMappingJson);
    const phoneNumberId = parsePhoneNumberId(values.phoneNumberId);

    if (isEdit && rule) {
      await updateMutation.mutateAsync({
        ruleId: rule.id,
        body: {
          eventKey: values.eventKey,
          name: values.name,
          templateId: values.templateId,
          phoneNumberId: phoneNumberId ?? null,
          enabled: values.enabled,
          priority: values.priority,
          variableMapping,
        },
      });
    } else {
      await createMutation.mutateAsync({
        eventKey: values.eventKey,
        name: values.name,
        templateId: values.templateId,
        phoneNumberId,
        enabled: values.enabled,
        priority: values.priority,
        variableMapping,
      });
    }

    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit notification rule' : 'Create notification rule'}</DialogTitle>
          <DialogDescription>
            Map an inbound event key to a WhatsApp template and variable mapping.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Order shipped notification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event key</FormLabel>
                  <FormControl>
                    <Input placeholder="order.shipped" {...field} />
                  </FormControl>
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
                        {templatesQuery.data?.map((option) => (
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
            <FormField
              control={form.control}
              name="phoneNumberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number (optional)</FormLabel>
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
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={field.value}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel>Enabled</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variableMappingJson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable mapping (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={'{\n  "1": "{{customerName}}"\n}'}
                      className="min-h-24 font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maps template variable placeholders to event payload paths.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create rule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
