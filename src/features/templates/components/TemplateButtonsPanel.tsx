import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useCallback, type ReactNode } from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { TemplateCreateFormValues } from '@/features/templates/schemas';
import {
  BUTTON_LIMITS,
  createButtonRowId,
  hasCtaButtonsEnabled,
} from '@/features/templates/utils/buttonValidation';

type TemplateButtonsPanelProps = {
  form: UseFormReturn<TemplateCreateFormValues>;
};

type ReorderControlsProps = {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

function ReorderControls({ index, total, onMoveUp, onMoveDown }: ReorderControlsProps) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5 pt-1">
      <GripVertical className="mb-0.5 h-4 w-4 text-muted-foreground" aria-hidden />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={index === 0}
        onClick={onMoveUp}
        aria-label="Move up"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={index === total - 1}
        onClick={onMoveDown}
        aria-label="Move down"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function TemplateButtonsPanel({ form }: TemplateButtonsPanelProps) {
  const enableQuickReplies = form.watch('enableQuickReplies');
  const enableCallToAction = form.watch('enableCallToAction');
  const enablePhoneButton = form.watch('enablePhoneButton');
  const enableCopyCode = form.watch('enableCopyCode');
  const phoneButtonText = form.watch('phoneButtonText') ?? '';
  const copyCodeText = form.watch('copyCodeText') ?? '';
  const copyCodeExample = form.watch('copyCodeExample') ?? '';

  const ctaGroupActive = hasCtaButtonsEnabled({
    enableCallToAction,
    enablePhoneButton,
    enableCopyCode,
  });

  const {
    fields: quickReplyFields,
    append: appendQuickReply,
    remove: removeQuickReply,
    move: moveQuickReply,
  } = useFieldArray({
    control: form.control,
    name: 'quickReplyButtons',
  });

  const {
    fields: urlFields,
    append: appendUrl,
    remove: removeUrl,
    move: moveUrl,
  } = useFieldArray({
    control: form.control,
    name: 'urlButtons',
  });

  const disableCtaSections = enableQuickReplies;
  const disableQuickReplies = ctaGroupActive;

  const handleQuickRepliesToggle = useCallback(
    (checked: boolean) => {
      form.setValue('enableQuickReplies', checked);
      if (checked) {
        form.setValue('enableCallToAction', false);
        form.setValue('enablePhoneButton', false);
        form.setValue('enableCopyCode', false);
        form.setValue('linkTrackingEnabled', false);
        if (form.getValues('quickReplyButtons').length === 0) {
          appendQuickReply({ id: createButtonRowId(), text: '' });
        }
      }
    },
    [appendQuickReply, form],
  );

  const handleCtaSectionToggle = useCallback(
    (
      field: 'enableCallToAction' | 'enablePhoneButton' | 'enableCopyCode',
      checked: boolean,
    ) => {
      form.setValue(field, checked);
      if (checked) {
        form.setValue('enableQuickReplies', false);
        if (field === 'enableCallToAction' && form.getValues('urlButtons').length === 0) {
          appendUrl({ id: createButtonRowId(), text: '', url: '', urlType: 'static' });
        }
      }
      if (field === 'enableCallToAction' && !checked) {
        form.setValue('linkTrackingEnabled', false);
      }
    },
    [appendUrl, form],
  );

  return (
    <div className="space-y-4">
      <ButtonSection
        title="Custom replies"
        description={`Quick reply buttons (max ${BUTTON_LIMITS.quickReply}). Cannot combine with call-to-action buttons.`}
        enabled={enableQuickReplies}
        disabled={disableQuickReplies}
        onToggle={handleQuickRepliesToggle}
      >
        <div className="space-y-3">
          {quickReplyFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <ReorderControls
                index={index}
                total={quickReplyFields.length}
                onMoveUp={() => moveQuickReply(index, index - 1)}
                onMoveDown={() => moveQuickReply(index, index + 1)}
              />
              <FormField
                control={form.control}
                name={`quickReplyButtons.${index}.text`}
                render={({ field: textField }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Reply {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Reply ${index + 1}`} maxLength={25} {...textField} />
                    </FormControl>
                    <FormDescription>{(textField.value ?? '').length}/25</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-0.5 shrink-0"
                disabled={quickReplyFields.length <= 1}
                onClick={() => removeQuickReply(index)}
                aria-label="Remove reply"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {quickReplyFields.length < BUTTON_LIMITS.quickReply ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendQuickReply({ id: createButtonRowId(), text: '' })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add reply
            </Button>
          ) : null}
        </div>
      </ButtonSection>

      <ButtonSection
        title="Call to action"
        description={`Website links (max ${BUTTON_LIMITS.url}). Static or dynamic URL with variables.`}
        enabled={enableCallToAction}
        disabled={disableCtaSections}
        onToggle={(checked) => handleCtaSectionToggle('enableCallToAction', checked)}
      >
        <div className="space-y-4">
          {urlFields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-md border bg-muted/20 p-3">
              <div className="flex gap-2">
                <ReorderControls
                  index={index}
                  total={urlFields.length}
                  onMoveUp={() => moveUrl(index, index - 1)}
                  onMoveDown={() => moveUrl(index, index + 1)}
                />
                <div className="flex-1 space-y-3">
                  <FormField
                    control={form.control}
                    name={`urlButtons.${index}.text`}
                    render={({ field: textField }) => (
                      <FormItem>
                        <FormLabel>Button text</FormLabel>
                        <FormControl>
                          <Input placeholder="Visit our website" maxLength={25} {...textField} />
                        </FormControl>
                        <FormDescription>{(textField.value ?? '').length}/25</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`urlButtons.${index}.urlType`}
                    render={({ field: typeField }) => (
                      <FormItem>
                        <FormLabel>URL type</FormLabel>
                        <Select onValueChange={typeField.onChange} value={typeField.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="static">Static URL</SelectItem>
                            <SelectItem value="dynamic">Dynamic URL (with variables)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`urlButtons.${index}.url`}
                    render={({ field: urlField }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              form.watch(`urlButtons.${index}.urlType`) === 'dynamic'
                                ? 'https://example.com/{{user_id}}'
                                : 'https://extrahand.in'
                            }
                            maxLength={2000}
                            {...urlField}
                          />
                        </FormControl>
                        <FormDescription>{(urlField.value ?? '').length}/2000</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  disabled={urlFields.length <= 1}
                  onClick={() => removeUrl(index)}
                  aria-label="Remove URL button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {urlFields.length < BUTTON_LIMITS.url ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendUrl({ id: createButtonRowId(), text: '', url: '', urlType: 'static' })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add website button
            </Button>
          ) : null}

          <FormField
            control={form.control}
            name="linkTrackingEnabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-4 rounded-md border p-3">
                <div>
                  <FormLabel>Link tracking</FormLabel>
                  <FormDescription>
                    Stored locally for analytics — not sent to Meta.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </ButtonSection>

      <ButtonSection
        title="Mobile number"
        description="Let customers call a phone number from the template."
        enabled={enablePhoneButton}
        disabled={disableCtaSections}
        onToggle={(checked) => handleCtaSectionToggle('enablePhoneButton', checked)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phoneButtonText"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Button text</FormLabel>
                <FormControl>
                  <Input placeholder="Call us" maxLength={25} {...field} />
                </FormControl>
                <FormDescription>{phoneButtonText.length}/25</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneCountryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country code</FormLabel>
                <FormControl>
                  <Input placeholder="+91" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="9876543210" inputMode="numeric" maxLength={15} {...field} />
                </FormControl>
                <FormDescription>10-digit mobile number for +91</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </ButtonSection>

      <ButtonSection
        title="Copy code"
        description="Offer code customers can copy from the message."
        enabled={enableCopyCode}
        disabled={disableCtaSections}
        onToggle={(checked) => handleCtaSectionToggle('enableCopyCode', checked)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="copyCodeText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button text</FormLabel>
                <FormControl>
                  <Input placeholder="Copy offer code" maxLength={25} {...field} />
                </FormControl>
                <FormDescription>{copyCodeText.length}/25</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="copyCodeExample"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Example code</FormLabel>
                <FormControl>
                  <Input placeholder="SAVE20" maxLength={15} {...field} />
                </FormControl>
                <FormDescription>{copyCodeExample.length}/15</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </ButtonSection>
    </div>
  );
}

type ButtonSectionProps = {
  title: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
  onToggle: (checked: boolean) => void;
  children: ReactNode;
};

function ButtonSection({
  title,
  description,
  enabled,
  disabled,
  onToggle,
  children,
}: ButtonSectionProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Switch checked={enabled} disabled={disabled && !enabled} onCheckedChange={onToggle} />
      </div>
      {enabled ? children : null}
    </div>
  );
}
