import { useMemo } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import type { TemplateCreateFormValues } from '@/features/templates/schemas';
import { draftToPreview, formValuesToDraftPreview } from '@/features/templates/utils/draftToPreview';
import type { TemplatePreviewDto } from '@/features/templates/types';

const PREVIEW_WATCH_FIELDS = [
  'templateFormat',
  'carouselCards',
  'headerType',
  'headerText',
  'bodyText',
  'enableFooter',
  'footerText',
  'variableSamples',
  'enableQuickReplies',
  'quickReplyButtons',
  'enableCallToAction',
  'urlButtons',
  'enablePhoneButton',
  'phoneButtonText',
  'phoneCountryCode',
  'phoneNumber',
  'enableCopyCode',
  'copyCodeText',
  'copyCodeExample',
] as const satisfies readonly (keyof TemplateCreateFormValues)[];

export function useTemplateCreateLivePreview(
  form: UseFormReturn<TemplateCreateFormValues>,
  mediaPreviewUrl?: string,
): TemplatePreviewDto {
  const watched = useWatch({
    control: form.control,
    name: PREVIEW_WATCH_FIELDS,
  });

  return useMemo(() => {
    const current = form.getValues();
    const draft = formValuesToDraftPreview(current);
    return draftToPreview({ ...draft, mediaPreviewUrl });
  }, [watched, mediaPreviewUrl, form]);
}
