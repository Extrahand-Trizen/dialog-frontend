import type { TemplateCreateFormValues } from '@/features/templates/schemas';
import type { TemplatePreviewDto } from '@/features/templates/types';
import { buildButtonsFromForm } from '@/features/templates/utils/buttonValidation';
import { extractPlaceholders, substituteVariableSamples } from '@/features/templates/utils/templateVariables';

export type DraftPreviewInput = Pick<
  TemplateCreateFormValues,
  | 'templateFormat'
  | 'carouselCards'
  | 'headerType'
  | 'headerText'
  | 'bodyText'
  | 'enableFooter'
  | 'footerText'
  | 'variableSamples'
  | 'enableQuickReplies'
  | 'quickReplyButtons'
  | 'enableCallToAction'
  | 'urlButtons'
  | 'enablePhoneButton'
  | 'phoneButtonText'
  | 'phoneCountryCode'
  | 'phoneNumber'
  | 'enableCopyCode'
  | 'copyCodeText'
  | 'copyCodeExample'
> & {
  mediaPreviewUrl?: string;
};

export function formValuesToDraftPreview(values: TemplateCreateFormValues): DraftPreviewInput {
  return {
    templateFormat: values.templateFormat ?? 'standard',
    carouselCards: values.carouselCards ?? [],
    headerType: values.headerType,
    headerText: values.headerText,
    bodyText: values.bodyText ?? '',
    enableFooter: values.enableFooter,
    footerText: values.footerText,
    variableSamples: values.variableSamples ?? {},
    enableQuickReplies: values.enableQuickReplies,
    quickReplyButtons: values.quickReplyButtons ?? [],
    enableCallToAction: values.enableCallToAction,
    urlButtons: values.urlButtons ?? [],
    enablePhoneButton: values.enablePhoneButton,
    phoneButtonText: values.phoneButtonText,
    phoneCountryCode: values.phoneCountryCode,
    phoneNumber: values.phoneNumber,
    enableCopyCode: values.enableCopyCode,
    copyCodeText: values.copyCodeText,
    copyCodeExample: values.copyCodeExample,
  };
}

function draftToFormSlice(draft: DraftPreviewInput): TemplateCreateFormValues {
  return {
    name: '',
    language: 'en',
    category: 'UTILITY',
    templateFormat: draft.templateFormat ?? 'standard',
    carouselCards: draft.carouselCards ?? [],
    headerType: draft.headerType,
    headerText: draft.headerText,
    headerMediaHandle: '',
    headerMediaFormat: undefined,
    headerMediaFileName: '',
    bodyText: draft.bodyText,
    variableSamples: draft.variableSamples,
    enableFooter: draft.enableFooter,
    footerText: draft.footerText,
    enableQuickReplies: draft.enableQuickReplies,
    quickReplyButtons: draft.quickReplyButtons,
    enableCallToAction: draft.enableCallToAction,
    urlButtons: draft.urlButtons,
    linkTrackingEnabled: false,
    enablePhoneButton: draft.enablePhoneButton,
    phoneButtonText: draft.phoneButtonText,
    phoneCountryCode: draft.phoneCountryCode,
    phoneNumber: draft.phoneNumber,
    enableCopyCode: draft.enableCopyCode,
    copyCodeText: draft.copyCodeText,
    copyCodeExample: draft.copyCodeExample,
  };
}

export function draftToPreview(draft: DraftPreviewInput): TemplatePreviewDto {
  if (draft.templateFormat === 'carousel') {
    const bodyText = substituteVariableSamples(draft.bodyText, draft.variableSamples);

    return {
      templateKind: 'carousel',
      headerType: 'none',
      bodyText: bodyText || 'Intro message…',
      buttons: [],
      carouselCards: (draft.carouselCards ?? []).map((card) => ({
        headerType: 'image' as const,
        bodyText: card.bodyText.trim() || 'Card body…',
        buttonText:
          card.enableButton && card.buttonText.trim() ? card.buttonText.trim() : undefined,
      })),
      variables: extractPlaceholders(draft.bodyText).map((key) => ({
        key,
        sample: draft.variableSamples[key],
      })),
    };
  }

  const placeholders = extractPlaceholders(draft.headerText ?? '', draft.bodyText);

  const headerText =
    draft.headerType === 'text' && draft.headerText?.trim()
      ? substituteVariableSamples(draft.headerText, draft.variableSamples)
      : undefined;

  const bodyText = substituteVariableSamples(draft.bodyText, draft.variableSamples);
  const requestButtons = buildButtonsFromForm(draftToFormSlice(draft));

  const buttons: TemplatePreviewDto['buttons'] = requestButtons.map((button) => {
    if (button.type === 'URL') {
      return {
        type: 'URL',
        text: button.text,
        url: substituteVariableSamples(button.url, draft.variableSamples),
      };
    }
    if (button.type === 'PHONE_NUMBER') {
      return {
        type: 'PHONE_NUMBER',
        text: button.text,
        phoneNumber: `+${button.phoneNumber}`,
      };
    }
    if (button.type === 'COPY_CODE') {
      return { type: 'COPY_CODE', text: button.text, example: button.example };
    }
    return { type: 'QUICK_REPLY', text: button.text };
  });

  return {
    templateKind: 'standard',
    headerType: draft.headerType === 'none' ? 'none' : draft.headerType,
    headerText,
    bodyText: bodyText || 'Body text…',
    footerText: draft.enableFooter ? draft.footerText?.trim() : undefined,
    buttons,
    variables: placeholders.map((key) => ({
      key,
      sample: draft.variableSamples[key],
    })),
  };
}
