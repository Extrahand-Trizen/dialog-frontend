import type { TemplateCreateFormValues } from '@/features/templates/schemas';

export const BUTTON_LIMITS = {
  quickReply: 3,
  url: 2,
  phone: 1,
  copyCode: 1,
} as const;

export function createButtonRowId(): string {
  return crypto.randomUUID();
}

export function createCarouselCardId(): string {
  return crypto.randomUUID();
}

export function normalizePhoneNumber(countryCode: string, nationalNumber: string): string {
  const code = countryCode.replace(/\D/g, '');
  const national = nationalNumber.replace(/\D/g, '');
  return code + national;
}

export function isValidPhoneForCountry(countryCode: string, nationalNumber: string): boolean {
  const code = countryCode.replace(/\D/g, '');
  const national = nationalNumber.replace(/\D/g, '');

  if (code === '91') {
    return /^\d{10}$/.test(national);
  }

  return national.length >= 8 && national.length <= 12;
}

export function hasCtaButtonsEnabled(values: Pick<
  TemplateCreateFormValues,
  'enableCallToAction' | 'enablePhoneButton' | 'enableCopyCode'
>): boolean {
  return values.enableCallToAction || values.enablePhoneButton || values.enableCopyCode;
}

export function buildButtonsFromForm(
  values: TemplateCreateFormValues,
): import('@/features/templates/types').TemplateButtonRequest[] {
  const buttons: import('@/features/templates/types').TemplateButtonRequest[] = [];

  if (values.enableQuickReplies) {
    for (const row of values.quickReplyButtons) {
      if (row.text.trim()) {
        buttons.push({ type: 'QUICK_REPLY', text: row.text.trim() });
      }
    }
    return buttons;
  }

  if (values.enableCallToAction) {
    for (const row of values.urlButtons) {
      if (row.text.trim() && row.url.trim()) {
        buttons.push({
          type: 'URL',
          text: row.text.trim(),
          url: row.url.trim(),
          urlType: row.urlType,
        });
      }
    }
  }

  if (values.enablePhoneButton && values.phoneButtonText?.trim() && values.phoneNumber?.trim()) {
    buttons.push({
      type: 'PHONE_NUMBER',
      text: values.phoneButtonText.trim(),
      phoneNumber: normalizePhoneNumber(values.phoneCountryCode, values.phoneNumber),
    });
  }

  if (values.enableCopyCode && values.copyCodeText?.trim() && values.copyCodeExample?.trim()) {
    buttons.push({
      type: 'COPY_CODE',
      text: values.copyCodeText.trim(),
      example: values.copyCodeExample.trim(),
    });
  }

  return buttons;
}
