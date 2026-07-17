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
  variables: z.record(z.string(), z.string()).default({}),
});

export type SendMessageFormValues = z.infer<typeof sendMessageFormSchema>;

export function parsePhoneNumberId(value: string): string | undefined {
  return value === PHONE_DEFAULT_VALUE ? undefined : value;
}
