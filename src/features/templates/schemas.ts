import { z } from 'zod';
import { TEMPLATE_CATEGORIES, TEMPLATE_FORMATS, TEMPLATE_HEADER_TYPES } from '@/features/templates/types';
import {
  BUTTON_LIMITS,
  buildButtonsFromForm,
  hasCtaButtonsEnabled,
  isValidPhoneForCountry,
} from '@/features/templates/utils/buttonValidation';

const quickReplyRowSchema = z.object({
  id: z.string(),
  text: z.string().max(25),
});

const urlButtonRowSchema = z.object({
  id: z.string(),
  text: z.string().max(25),
  url: z.string().max(2000),
  urlType: z.enum(['static', 'dynamic']),
});

const carouselCardRowSchema = z.object({
  id: z.string(),
  imageHandle: z.string(),
  imageFileName: z.string(),
  bodyText: z.string().max(160),
  enableButton: z.boolean(),
  buttonText: z.string().max(25),
  buttonUrl: z.string().max(2000),
});

export const templateCreateWizardSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(512)
    .regex(/^[a-z][a-z0-9_]*$/, 'Use lowercase letters, numbers, and underscores'),
  language: z.string().min(2).max(10),
  category: z.enum(TEMPLATE_CATEGORIES),
  templateFormat: z.enum(TEMPLATE_FORMATS),
});

export type TemplateCreateWizardValues = z.infer<typeof templateCreateWizardSchema>;

export const TEMPLATE_CREATE_WIZARD_DEFAULTS: TemplateCreateWizardValues = {
  name: '',
  language: 'en',
  category: 'UTILITY',
  templateFormat: 'standard',
};

export const templateCreateFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(512)
      .regex(/^[a-z][a-z0-9_]*$/, 'Use lowercase letters, numbers, and underscores'),
    language: z.string().min(2).max(10),
    category: z.enum(TEMPLATE_CATEGORIES),
    templateFormat: z.enum(TEMPLATE_FORMATS),
    carouselCards: z.array(carouselCardRowSchema),
    headerType: z.enum(TEMPLATE_HEADER_TYPES),
    headerText: z.string().max(60).optional(),
    headerMediaHandle: z.string().optional(),
    headerMediaFormat: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
    headerMediaFileName: z.string().optional(),
    bodyText: z.string().min(1, 'Body is required').max(1024),
    variableSamples: z.record(z.string(), z.string().max(200)),
    enableFooter: z.boolean(),
    footerText: z.string().max(60).optional(),
    enableQuickReplies: z.boolean(),
    quickReplyButtons: z.array(quickReplyRowSchema),
    enableCallToAction: z.boolean(),
    urlButtons: z.array(urlButtonRowSchema),
    linkTrackingEnabled: z.boolean(),
    enablePhoneButton: z.boolean(),
    phoneButtonText: z.string().max(25).optional(),
    phoneCountryCode: z.string().max(6),
    phoneNumber: z.string().max(15).optional(),
    enableCopyCode: z.boolean(),
    copyCodeText: z.string().max(25).optional(),
    copyCodeExample: z.string().max(15).optional(),
  })
  .superRefine((values, ctx) => {
    const isCarousel = values.templateFormat === 'carousel';

    if (isCarousel) {
      if (values.carouselCards.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Add at least 2 carousel cards',
          path: ['carouselCards'],
        });
      }
      if (values.carouselCards.length > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At most 10 carousel cards are allowed',
          path: ['carouselCards'],
        });
      }

      values.carouselCards.forEach((card, index) => {
        if (!card.imageHandle.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Upload an image for this card',
            path: ['carouselCards', index, 'imageHandle'],
          });
        }
        if (!card.bodyText.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Card body text is required',
            path: ['carouselCards', index, 'bodyText'],
          });
        }
        if (card.enableButton) {
          if (!card.buttonText.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Button text is required',
              path: ['carouselCards', index, 'buttonText'],
            });
          }
          if (!card.buttonUrl.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Button URL is required',
              path: ['carouselCards', index, 'buttonUrl'],
            });
          }
        }
      });

      return;
    }

    if (values.headerType === 'text' && !values.headerText?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Header text is required for text headers',
        path: ['headerText'],
      });
    }
    if (
      (values.headerType === 'image' ||
        values.headerType === 'video' ||
        values.headerType === 'document') &&
      !values.headerMediaHandle?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Upload a header file before submitting',
        path: ['headerMediaHandle'],
      });
    }
    if (values.enableFooter && !values.footerText?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Footer text is required when footer is enabled',
        path: ['footerText'],
      });
    }

    if (values.enableQuickReplies && hasCtaButtonsEnabled(values)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Quick replies cannot be combined with call-to-action buttons',
        path: ['enableQuickReplies'],
      });
    }

    if (values.enableQuickReplies) {
      const filled = values.quickReplyButtons.filter((row) => row.text.trim());
      if (filled.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Add at least one quick reply button',
          path: ['quickReplyButtons'],
        });
      }
      if (filled.length > BUTTON_LIMITS.quickReply) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `At most ${BUTTON_LIMITS.quickReply} quick reply buttons are allowed`,
          path: ['quickReplyButtons'],
        });
      }
    }

    if (values.enableCallToAction) {
      const filled = values.urlButtons.filter((row) => row.text.trim() || row.url.trim());
      if (filled.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Add at least one website button',
          path: ['urlButtons'],
        });
      }
      values.urlButtons.forEach((row, index) => {
        if (!row.text.trim() && !row.url.trim()) {
          return;
        }
        if (!row.text.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Button text is required',
            path: ['urlButtons', index, 'text'],
          });
        }
        if (!row.url.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Website URL is required',
            path: ['urlButtons', index, 'url'],
          });
        }
      });
      if (values.urlButtons.filter((row) => row.text.trim() && row.url.trim()).length > BUTTON_LIMITS.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `At most ${BUTTON_LIMITS.url} URL buttons are allowed`,
          path: ['urlButtons'],
        });
      }
    }

    if (values.enablePhoneButton) {
      if (!values.phoneButtonText?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone button text is required',
          path: ['phoneButtonText'],
        });
      }
      if (!values.phoneNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone number is required',
          path: ['phoneNumber'],
        });
      } else if (!isValidPhoneForCountry(values.phoneCountryCode, values.phoneNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid 10-digit mobile number for +91',
          path: ['phoneNumber'],
        });
      }
    }

    if (values.enableCopyCode) {
      if (!values.copyCodeText?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Copy code button text is required',
          path: ['copyCodeText'],
        });
      }
      if (!values.copyCodeExample?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Copy code example is required',
          path: ['copyCodeExample'],
        });
      }
    }
  });

export type TemplateCreateFormValues = z.infer<typeof templateCreateFormSchema>;

export const TEMPLATE_CREATE_DEFAULTS: TemplateCreateFormValues = {
  name: '',
  language: 'en',
  category: 'UTILITY',
  templateFormat: 'standard',
  carouselCards: [],
  headerType: 'none',
  headerText: '',
  headerMediaHandle: '',
  headerMediaFormat: undefined,
  headerMediaFileName: '',
  bodyText: '',
  variableSamples: {},
  enableFooter: false,
  footerText: '',
  enableQuickReplies: false,
  quickReplyButtons: [],
  enableCallToAction: false,
  urlButtons: [],
  linkTrackingEnabled: false,
  enablePhoneButton: false,
  phoneButtonText: '',
  phoneCountryCode: '+91',
  phoneNumber: '',
  enableCopyCode: false,
  copyCodeText: '',
  copyCodeExample: '',
};

export function toCreateTemplateRequest(
  values: TemplateCreateFormValues,
  whatsAppAccountId: string,
): import('@/features/templates/types').CreateTemplateRequest {
  const isCarousel = values.templateFormat === 'carousel';

  if (isCarousel) {
    return {
      whatsAppAccountId,
      name: values.name,
      language: values.language,
      category: values.category,
      templateFormat: 'carousel',
      body: { text: values.bodyText.trim() },
      carouselCards: values.carouselCards.map((card) => ({
        imageHandle: card.imageHandle.trim(),
        bodyText: card.bodyText.trim(),
        ...(card.enableButton && card.buttonText.trim() && card.buttonUrl.trim()
          ? {
              button: {
                type: 'URL' as const,
                text: card.buttonText.trim(),
                url: card.buttonUrl.trim(),
              },
            }
          : {}),
      })),
    };
  }

  let header: import('@/features/templates/types').CreateTemplateRequest['header'];

  if (values.headerType === 'text' && values.headerText?.trim()) {
    header = { text: values.headerText.trim() };
  } else if (
    (values.headerType === 'image' ||
      values.headerType === 'video' ||
      values.headerType === 'document') &&
    values.headerMediaHandle?.trim() &&
    values.headerMediaFormat
  ) {
    header = {
      format: values.headerMediaFormat,
      handle: values.headerMediaHandle.trim(),
    };
  }

  const variableSamples = Object.fromEntries(
    Object.entries(values.variableSamples ?? {}).filter(([, value]) => value.trim()),
  );

  const buttons = buildButtonsFromForm(values);

  return {
    whatsAppAccountId,
    name: values.name,
    language: values.language,
    category: values.category,
    templateFormat: 'standard',
    ...(header ? { header } : {}),
    body: { text: values.bodyText.trim() },
    ...(values.enableFooter && values.footerText?.trim()
      ? { footer: { text: values.footerText.trim() } }
      : {}),
    ...(Object.keys(variableSamples).length > 0 ? { variableSamples } : {}),
    ...(buttons.length > 0 ? { buttons } : {}),
    ...(values.linkTrackingEnabled && values.enableCallToAction
      ? { linkTrackingEnabled: true }
      : {}),
  };
}

export function toUpdateTemplateRequest(
  values: TemplateCreateFormValues,
  whatsAppAccountId: string,
): import('@/features/templates/types').UpdateTemplateRequest {
  const { name: _name, language: _language, category: _category, ...rest } =
    toCreateTemplateRequest(values, whatsAppAccountId);
  return rest;
}
