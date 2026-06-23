import { z } from 'zod';

const eventKeySchema = z
  .string()
  .min(1, 'Event key is required')
  .max(120)
  .regex(/^[a-zA-Z0-9._-]+$/, 'Use letters, numbers, dots, underscores, or hyphens');

export const PHONE_DEFAULT_VALUE = '__default__';

export const notificationRuleFormSchema = z.object({
  eventKey: eventKeySchema,
  name: z.string().min(1, 'Name is required').max(200),
  templateId: z.string().uuid('Select a template'),
  phoneNumberId: z.string(),
  enabled: z.boolean(),
  priority: z.number().int().min(0).max(100),
  variableMappingJson: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === '') return true;
        try {
          const parsed: unknown = JSON.parse(value);
          if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            return false;
          }
          return Object.entries(parsed).every(
            ([k, v]) => typeof k === 'string' && typeof v === 'string',
          );
        } catch {
          return false;
        }
      },
      { message: 'Must be valid JSON object with string values' },
    ),
});

export type NotificationRuleFormValues = z.infer<typeof notificationRuleFormSchema>;

export function parsePhoneNumberId(value: string): string | undefined {
  return value === PHONE_DEFAULT_VALUE || value === '' ? undefined : value;
}

export function parseVariableMappingJson(json: string | undefined): Record<string, string> {
  if (!json || json.trim() === '') return {};
  const parsed = JSON.parse(json) as Record<string, string>;
  return parsed;
}

export function stringifyVariableMapping(mapping: Record<string, string>): string {
  if (Object.keys(mapping).length === 0) return '';
  return JSON.stringify(mapping, null, 2);
}
