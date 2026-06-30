export const META_TEMPLATE_STATUSES = [
  'APPROVED',
  'PENDING',
  'REJECTED',
  'PAUSED',
  'DISABLED',
  'DELETED',
  'UNKNOWN',
] as const;

export const TEMPLATE_CATEGORIES = ['MARKETING', 'UTILITY', 'AUTHENTICATION'] as const;

export type MetaTemplateStatus = (typeof META_TEMPLATE_STATUSES)[number];
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export const TEMPLATE_FORMATS = ['standard', 'carousel'] as const;
export type TemplateFormat = (typeof TEMPLATE_FORMATS)[number];

export type CarouselCardPreview = {
  headerType: 'image';
  bodyText: string;
  buttonText?: string;
  imageHandle?: string;
  imageMediaUrl?: string;
};

export type CarouselCardFormRow = {
  id: string;
  imageHandle: string;
  imageMediaUrl: string;
  imageFileName: string;
  bodyText: string;
  enableButton: boolean;
  buttonText: string;
  buttonUrl: string;
};

export type TemplateButtonPreview =
  | { type: 'QUICK_REPLY'; text: string }
  | { type: 'URL'; text: string; url: string }
  | { type: 'PHONE_NUMBER'; text: string; phoneNumber: string }
  | { type: 'COPY_CODE'; text: string; example: string };

export type TemplateSummaryPreviewDto = {
  templateKind: TemplateFormat;
  headerType: 'none' | 'text' | 'image' | 'video' | 'document';
  headerText?: string;
  headerMediaHandle?: string;
  headerMediaUrl?: string;
  bodyText: string;
  footerText?: string;
  buttons: TemplateButtonPreview[];
  carouselCards?: CarouselCardPreview[];
};

export type TemplateSummaryDto = {
  id: string;
  organizationId: string;
  metaTemplateName: string;
  metaTemplateId: string | null;
  category: TemplateCategory;
  language: string;
  metaStatus: MetaTemplateStatus;
  currentVersion: number | null;
  updatedAt: string;
  createdAt: string;
  preview?: TemplateSummaryPreviewDto;
  createdByName?: string | null;
};

export type TemplateDetailDto = TemplateSummaryDto & {
  currentVersionDetail: {
    id: string;
    version: number;
    components: unknown;
    variableSchema: unknown;
    rejectionReason: string | null;
    submittedAt: string | null;
    approvedAt: string | null;
    createdAt: string;
  } | null;
};

export type SyncTemplatesRequest = {
  whatsAppAccountId: string;
};

export type TemplateButtonRequest =
  | { type: 'QUICK_REPLY'; text: string }
  | { type: 'URL'; text: string; url: string; urlType?: 'static' | 'dynamic' }
  | { type: 'PHONE_NUMBER'; text: string; phoneNumber: string }
  | { type: 'COPY_CODE'; text: string; example: string };

export type CreateTemplateRequest = {
  whatsAppAccountId: string;
  name: string;
  language: string;
  category: TemplateCategory;
  header?:
    | { text: string }
    | { format: 'IMAGE' | 'VIDEO' | 'DOCUMENT'; handle: string; mediaUrl?: string };
  body: { text: string };
  footer?: { text: string };
  variableSamples?: Record<string, string>;
  buttons?: TemplateButtonRequest[];
  linkTrackingEnabled?: boolean;
  templateFormat?: TemplateFormat;
  carouselCards?: Array<{
    imageHandle: string;
    imageMediaUrl?: string;
    bodyText: string;
    button?: { type: 'URL'; text: string; url: string } | { type: 'QUICK_REPLY'; text: string };
  }>;
};

export type UpdateTemplateRequest = Omit<
  CreateTemplateRequest,
  'name' | 'language' | 'category'
>;

/** @deprecated Use TemplateButtonRequest */
export type TemplateUrlButtonRequest = Extract<TemplateButtonRequest, { type: 'URL' }>;

export type TemplatePreviewDto = {
  templateKind: TemplateFormat;
  headerType: 'none' | 'text' | 'image' | 'video' | 'document';
  headerText?: string;
  headerMediaHandle?: string;
  headerMediaUrl?: string;
  bodyText: string;
  footerText?: string;
  buttons: TemplateButtonPreview[];
  carouselCards?: CarouselCardPreview[];
  variables: Array<{ key: string; index?: number; sample?: string }>;
};

export type UploadTemplateMediaResponse = {
  handle: string;
  mediaUrl: string;
  format: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  mimeType: string;
  fileName: string;
  byteLength: number;
};

export const TEMPLATE_HEADER_TYPES = ['none', 'text', 'image', 'video', 'document'] as const;
export type TemplateHeaderType = (typeof TEMPLATE_HEADER_TYPES)[number];

export type EnqueueTemplateSyncResponse = {
  whatsAppAccountId: string;
  queued: true;
};

export type ListTemplatesRequest = {
  page: number;
  limit: number;
  metaStatus?: MetaTemplateStatus;
  category?: TemplateCategory;
  search?: string;
};
