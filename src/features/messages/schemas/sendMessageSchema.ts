import { z } from 'zod';

export const PHONE_DEFAULT_VALUE = '__default__';

export const sendMessageFormSchema = z.object({
  to: z
    .string()
    .min(1, 'Recipient phone is required')
    .max(20, 'Phone number is too long')
    .refine((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 15;
    }, 'Enter a valid phone number with country code (e.g. 919876543210)'),
  templateId: z.string().uuid('Select an approved template'),
  phoneNumberId: z.string(),
  variables: z.record(z.string(), z.string()),
  /** Dynamic URL button suffix (task id) when template has …/{{1}} links. */
  buttonUrlSuffix: z.string().max(200).optional(),
});

export type SendMessageFormValues = z.infer<typeof sendMessageFormSchema>;

export function parsePhoneNumberId(value: string): string | undefined {
  return value === PHONE_DEFAULT_VALUE ? undefined : value;
}

export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export type TemplateVariableSlot = {
  key: string;
  label: string;
};

export function extractVariableSlots(variableSchema: unknown): TemplateVariableSlot[] {
  if (!variableSchema || typeof variableSchema !== 'object' || Array.isArray(variableSchema)) {
    return [];
  }

  const record = variableSchema as { variables?: unknown };
  if (!Array.isArray(record.variables)) {
    return [];
  }

  const slots: Array<TemplateVariableSlot & { index: number }> = [];

  for (const entry of record.variables) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    const row = entry as { index?: unknown; name?: unknown };
    const index = Number(row.index);
    if (!Number.isFinite(index)) continue;
    const name = typeof row.name === 'string' && row.name.length > 0 ? row.name : undefined;
    const key = name ?? String(index);
    slots.push({
      index,
      key,
      label: name ? `${name} ({{${index}}})` : `Variable {{${index}}}`,
    });
  }

  return slots
    .sort((a, b) => a.index - b.index)
    .map(({ key, label }) => ({ key, label }));
}

/** True when template has a URL button with a {{n}} placeholder. */
export function templateHasDynamicUrlButton(components: unknown): boolean {
  if (!Array.isArray(components)) return false;
  for (const raw of components) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const row = raw as { type?: unknown; buttons?: unknown };
    if (String(row.type || '').toUpperCase() !== 'BUTTONS' || !Array.isArray(row.buttons)) continue;
    for (const button of row.buttons) {
      if (!button || typeof button !== 'object' || Array.isArray(button)) continue;
      const b = button as { type?: unknown; url?: unknown };
      if (String(b.type || '').toUpperCase() !== 'URL') continue;
      if (typeof b.url === 'string' && /\{\{\d+\}\}/.test(b.url)) return true;
    }
  }
  return false;
}
