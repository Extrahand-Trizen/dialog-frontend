import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { TemplateCreateFormValues } from '@/features/templates/schemas';
import { extractPlaceholders } from '@/features/templates/utils/templateVariables';

type VariableFieldsPanelProps = {
  form: UseFormReturn<TemplateCreateFormValues>;
  headerText?: string;
  bodyText: string;
};

export function VariableFieldsPanel({ form, headerText, bodyText }: VariableFieldsPanelProps) {
  const placeholders = useMemo(
    () => extractPlaceholders(headerText ?? '', bodyText),
    [headerText, bodyText],
  );
  const variableSamples = form.watch('variableSamples') ?? {};

  if (placeholders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <p className="text-sm font-medium">Variable sample values</p>
      <p className="text-xs text-muted-foreground">
        Meta requires example values for approval when variables are used in the template.
      </p>
      {placeholders.map((key) => (
        <FormItem key={key}>
          <FormLabel>{`{{${key}}}`}</FormLabel>
          <Input
            placeholder={`Enter sample value of variable {{${key}}}`}
            value={variableSamples[key] ?? ''}
            onChange={(event) => {
              form.setValue(
                'variableSamples',
                { ...variableSamples, [key]: event.target.value },
                { shouldValidate: true },
              );
            }}
          />
          <FormMessage />
        </FormItem>
      ))}
      <FormDescription>Samples appear in the live preview when filled in.</FormDescription>
    </div>
  );
}
