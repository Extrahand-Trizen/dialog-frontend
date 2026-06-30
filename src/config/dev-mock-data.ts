import { DEV_MOCK_USER } from '@/config/dev-mock-auth';
import { paginateMockItems } from '@/config/dev-mock-pagination';
import type { ApiKeySummaryDto } from '@/features/api-keys/types';
import type {
  DashboardOverviewDto,
  DashboardPeriod,
  RecentActivityItemDto,
} from '@/features/dashboard/types';
import type { EventIngestDto, ListEventsRequest } from '@/features/events/types';
import type {
  ListMessagesRequest,
  MessageDetailDto,
  MessageSummaryDto,
} from '@/features/messages/types';
import type {
  ListNotificationRulesRequest,
  NotificationRuleDto,
} from '@/features/notification-rules/types';
import type {
  ListTemplatesRequest,
  TemplateDetailDto,
  TemplateSummaryDto,
} from '@/features/templates/types';
import type {
  PhoneNumberDto,
  WhatsAppAccountDto,
} from '@/features/whatsapp/types';
import type { PaginatedResult } from '@/types/api';

const ORG_ID = DEV_MOCK_USER.organizationId;

export const DEV_MOCK_WHATSAPP_ACCOUNT_ID = '00000000-0000-4000-8000-000000000010';
export const DEV_MOCK_PHONE_PRIMARY_ID = '00000000-0000-4000-8000-000000000011';
export const DEV_MOCK_PHONE_SECONDARY_ID = '00000000-0000-4000-8000-000000000012';

const MOCK_PERIOD_START: Record<DashboardPeriod, string> = {
  '7d': '2026-06-12T00:00:00.000Z',
  '30d': '2026-05-20T00:00:00.000Z',
  '90d': '2026-03-21T00:00:00.000Z',
};

const ts = (iso: string) => iso;

// ——— Dashboard ———

export function getDevMockOverview(period: DashboardPeriod): DashboardOverviewDto {
  const scale = period === '7d' ? 0.25 : period === '30d' ? 1 : 2.8;

  return {
    period,
    periodStart: MOCK_PERIOD_START[period],
    messages: {
      total: Math.round(1248 * scale),
      byStatus: {
        SENT: Math.round(42 * scale),
        DELIVERED: Math.round(980 * scale),
        READ: Math.round(712 * scale),
        FAILED: Math.round(18 * scale),
      },
      deliveryRate: 0.942,
      readRate: 0.571,
    },
    events: {
      total: Math.round(856 * scale),
      byStatus: {
        PROCESSED: Math.round(810 * scale),
        FAILED: Math.round(46 * scale),
      },
    },
    executions: {
      total: Math.round(798 * scale),
      byStatus: {
        SUCCESS: Math.round(752 * scale),
        FAILED: Math.round(46 * scale),
      },
    },
  };
}

export const DEV_MOCK_RECENT_ACTIVITY: RecentActivityItemDto[] = [
  {
    type: 'message',
    id: 'msg-001',
    occurredAt: ts('2026-06-19T09:42:00.000Z'),
    status: 'DELIVERED',
    recipientPhone: '+91 98765 43210',
    metaTemplateName: 'order_shipped_v2',
    correlationId: 'corr-a1b2c3',
  },
  {
    type: 'event',
    id: 'evt-001',
    occurredAt: ts('2026-06-19T09:41:12.000Z'),
    status: 'PROCESSED',
    eventKey: 'order.shipped',
    recipientPhone: '+91 98765 43210',
    correlationId: 'corr-a1b2c3',
  },
  {
    type: 'message',
    id: 'msg-002',
    occurredAt: ts('2026-06-19T09:18:33.000Z'),
    status: 'READ',
    recipientPhone: '+91 91234 56789',
    metaTemplateName: 'appointment_reminder',
    correlationId: 'corr-d4e5f6',
  },
  {
    type: 'message',
    id: 'msg-003',
    occurredAt: ts('2026-06-19T08:55:01.000Z'),
    status: 'FAILED',
    recipientPhone: '+91 99887 76655',
    metaTemplateName: 'payment_receipt',
    correlationId: null,
  },
  {
    type: 'event',
    id: 'evt-002',
    occurredAt: ts('2026-06-19T08:30:00.000Z'),
    status: 'PROCESSED',
    eventKey: 'payment.received',
    recipientPhone: '+91 91234 56789',
    correlationId: 'corr-g7h8i9',
  },
];

// ——— Templates ———

export const DEV_MOCK_TEMPLATES: TemplateSummaryDto[] = [
  {
    id: '00000000-0000-4000-8000-000000000020',
    organizationId: ORG_ID,
    metaTemplateName: 'order_shipped_v2',
    metaTemplateId: 'meta-tpl-1001',
    category: 'UTILITY',
    language: 'en',
    metaStatus: 'APPROVED',
    currentVersion: 2,
    updatedAt: ts('2026-06-18T14:00:00.000Z'),
    createdAt: ts('2026-01-10T10:00:00.000Z'),
    createdByName: 'Alex Morgan',
    preview: {
      templateKind: 'standard',
      headerType: 'text',
      headerText: 'Order update',
      bodyText: 'Hi {{1}}, your order #{{2}} has shipped and will arrive soon.',
      footerText: 'Team ExtraHand',
      buttons: [{ type: 'URL', text: 'Track order', url: 'https://extrahand.in/orders' }],
    },
  },
  {
    id: '00000000-0000-4000-8000-000000000021',
    organizationId: ORG_ID,
    metaTemplateName: 'appointment_reminder',
    metaTemplateId: 'meta-tpl-1002',
    category: 'UTILITY',
    language: 'en',
    metaStatus: 'APPROVED',
    currentVersion: 1,
    updatedAt: ts('2026-06-17T09:30:00.000Z'),
    createdAt: ts('2026-02-05T10:00:00.000Z'),
    createdByName: 'Priya Sharma',
    preview: {
      templateKind: 'standard',
      headerType: 'none',
      bodyText: 'Reminder: your appointment is tomorrow at {{1}}.',
      buttons: [
        { type: 'QUICK_REPLY', text: 'Confirm' },
        { type: 'QUICK_REPLY', text: 'Reschedule' },
      ],
    },
  },
  {
    id: '00000000-0000-4000-8000-000000000022',
    organizationId: ORG_ID,
    metaTemplateName: 'payment_receipt',
    metaTemplateId: 'meta-tpl-1003',
    category: 'UTILITY',
    language: 'en',
    metaStatus: 'APPROVED',
    currentVersion: 3,
    updatedAt: ts('2026-06-16T11:20:00.000Z'),
    createdAt: ts('2026-02-20T10:00:00.000Z'),
    createdByName: null,
    preview: {
      templateKind: 'standard',
      headerType: 'none',
      bodyText: 'Payment of ₹{{1}} received. Receipt #{{2}}.',
      footerText: 'ExtraHand Payments',
      buttons: [],
    },
  },
  {
    id: '00000000-0000-4000-8000-000000000023',
    organizationId: ORG_ID,
    metaTemplateName: 'festive_promo_june',
    metaTemplateId: 'meta-tpl-1004',
    category: 'MARKETING',
    language: 'en',
    metaStatus: 'PENDING',
    currentVersion: 1,
    updatedAt: ts('2026-06-19T08:00:00.000Z'),
    createdAt: ts('2026-06-18T10:00:00.000Z'),
    createdByName: 'Alex Morgan',
    preview: {
      templateKind: 'standard',
      headerType: 'image',
      bodyText: 'June sale is live! Get 20% off selected services.',
      buttons: [{ type: 'URL', text: 'Shop now', url: 'https://extrahand.in/sale' }],
    },
  },
  {
    id: '00000000-0000-4000-8000-000000000024',
    organizationId: ORG_ID,
    metaTemplateName: 'otp_login',
    metaTemplateId: 'meta-tpl-1005',
    category: 'AUTHENTICATION',
    language: 'en',
    metaStatus: 'APPROVED',
    currentVersion: 1,
    updatedAt: ts('2026-05-01T12:00:00.000Z'),
    createdAt: ts('2026-03-01T10:00:00.000Z'),
    createdByName: null,
    preview: {
      templateKind: 'standard',
      headerType: 'none',
      bodyText: '{{1}} is your verification code. Do not share it.',
      buttons: [{ type: 'COPY_CODE', text: 'Copy code', example: '482910' }],
    },
  },
  {
    id: '00000000-0000-4000-8000-000000000025',
    organizationId: ORG_ID,
    metaTemplateName: 'legacy_welcome',
    metaTemplateId: 'meta-tpl-1006',
    category: 'MARKETING',
    language: 'hi',
    metaStatus: 'REJECTED',
    currentVersion: 1,
    updatedAt: ts('2026-04-12T16:45:00.000Z'),
    createdAt: ts('2026-04-01T10:00:00.000Z'),
    createdByName: 'Priya Sharma',
    preview: {
      templateKind: 'standard',
      headerType: 'none',
      bodyText: 'Welcome to ExtraHand! Start earning with flexible helper jobs.',
      buttons: [{ type: 'PHONE_NUMBER', text: 'Call support', phoneNumber: '+919876543210' }],
    },
  },
  {
    id: '00000000-0000-4000-8000-000000000026',
    organizationId: ORG_ID,
    metaTemplateName: 'summer_collection_carousel',
    metaTemplateId: 'meta-tpl-1007',
    category: 'MARKETING',
    language: 'en',
    metaStatus: 'APPROVED',
    currentVersion: 1,
    updatedAt: ts('2026-06-19T10:00:00.000Z'),
    createdAt: ts('2026-06-15T10:00:00.000Z'),
    createdByName: 'Alex Morgan',
    preview: {
      templateKind: 'carousel',
      headerType: 'none',
      bodyText: 'Swipe through our summer picks — limited time offers inside.',
      buttons: [],
      carouselCards: [
        { headerType: 'image', bodyText: 'Outdoor essentials from ₹499', buttonText: 'Shop' },
        { headerType: 'image', bodyText: 'Home refresh deals up to 30% off', buttonText: 'View' },
        { headerType: 'image', bodyText: 'New arrivals this week', buttonText: 'Browse' },
      ],
    },
  },
];

export function filterDevMockTemplates(
  req: ListTemplatesRequest,
): PaginatedResult<TemplateSummaryDto> {
  let items = [...DEV_MOCK_TEMPLATES];

  if (req.metaStatus) {
    items = items.filter((t) => t.metaStatus === req.metaStatus);
  }
  if (req.category) {
    items = items.filter((t) => t.category === req.category);
  }
  if (req.search?.trim()) {
    const q = req.search.trim().toLowerCase();
    items = items.filter((t) => t.metaTemplateName.toLowerCase().includes(q));
  }

  return paginateMockItems(items, req.page, req.limit);
}

export function getDevMockTemplateDetail(templateId: string): TemplateDetailDto | undefined {
  const summary = DEV_MOCK_TEMPLATES.find((t) => t.id === templateId);
  if (!summary) return undefined;

  const componentsById: Record<string, unknown> = {
    '00000000-0000-4000-8000-000000000020': [
      { type: 'HEADER', format: 'TEXT', text: 'Order update', example: { header_text: ['Order update'] } },
      { type: 'BODY', text: 'Hi {{1}}, your order #{{2}} has shipped.', example: { body_text: [['Ravi', '1042']] } },
      { type: 'FOOTER', text: 'Team ExtraHand' },
      {
        type: 'BUTTONS',
        buttons: [{ type: 'URL', text: 'Track order', url: 'https://extrahand.in/orders' }],
      },
    ],
    '00000000-0000-4000-8000-000000000025': [
      { type: 'BODY', text: 'Welcome to ExtraHand! Start earning with flexible helper jobs.' },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'PHONE_NUMBER', text: 'Call support', phone_number: '919876543210' },
        ],
      },
    ],
  };

  const components = componentsById[templateId] ?? [
    { type: 'BODY', text: summary.preview?.bodyText ?? `Sample body for ${summary.metaTemplateName}` },
  ];

  return {
    ...summary,
    currentVersionDetail: {
      id: `ver-${summary.id}`,
      version: summary.currentVersion ?? 1,
      components,
      variableSchema: {
        variables: [
          { index: 1, name: 'name' },
          { index: 2, name: 'order_id' },
        ],
      },
      rejectionReason: summary.metaStatus === 'REJECTED' ? 'Promotional content policy' : null,
      submittedAt: summary.createdAt,
      approvedAt: summary.metaStatus === 'APPROVED' ? summary.updatedAt : null,
      createdAt: summary.createdAt,
    },
  };
}

// ——— Messages ———

const messageBase = (
  partial: Omit<MessageSummaryDto, 'organizationId' | 'phoneNumberId' | 'type'>,
): MessageSummaryDto => ({
  organizationId: ORG_ID,
  phoneNumberId: DEV_MOCK_PHONE_PRIMARY_ID,
  type: 'template',
  ...partial,
});

export const DEV_MOCK_MESSAGES: MessageSummaryDto[] = [
  messageBase({
    id: '00000000-0000-4000-8000-000000000030',
    correlationId: 'corr-a1b2c3',
    recipientPhone: '+91 98765 43210',
    metaTemplateName: 'order_shipped_v2',
    metaMessageId: 'wamid.mock001',
    status: 'DELIVERED',
    errorCode: null,
    errorMessage: null,
    sentAt: ts('2026-06-19T09:40:00.000Z'),
    deliveredAt: ts('2026-06-19T09:42:00.000Z'),
    readAt: null,
    failedAt: null,
    createdAt: ts('2026-06-19T09:39:55.000Z'),
    updatedAt: ts('2026-06-19T09:42:00.000Z'),
  }),
  messageBase({
    id: '00000000-0000-4000-8000-000000000031',
    correlationId: 'corr-d4e5f6',
    recipientPhone: '+91 91234 56789',
    metaTemplateName: 'appointment_reminder',
    metaMessageId: 'wamid.mock002',
    status: 'READ',
    errorCode: null,
    errorMessage: null,
    sentAt: ts('2026-06-19T09:15:00.000Z'),
    deliveredAt: ts('2026-06-19T09:16:00.000Z'),
    readAt: ts('2026-06-19T09:18:33.000Z'),
    failedAt: null,
    createdAt: ts('2026-06-19T09:14:50.000Z'),
    updatedAt: ts('2026-06-19T09:18:33.000Z'),
  }),
  messageBase({
    id: '00000000-0000-4000-8000-000000000032',
    correlationId: null,
    recipientPhone: '+91 99887 76655',
    metaTemplateName: 'payment_receipt',
    metaMessageId: null,
    status: 'FAILED',
    errorCode: '131026',
    errorMessage: 'Message undeliverable',
    sentAt: ts('2026-06-19T08:54:00.000Z'),
    deliveredAt: null,
    readAt: null,
    failedAt: ts('2026-06-19T08:55:01.000Z'),
    createdAt: ts('2026-06-19T08:53:40.000Z'),
    updatedAt: ts('2026-06-19T08:55:01.000Z'),
  }),
  messageBase({
    id: '00000000-0000-4000-8000-000000000033',
    correlationId: 'corr-g7h8i9',
    recipientPhone: '+91 91234 56789',
    metaTemplateName: 'payment_receipt',
    metaMessageId: 'wamid.mock003',
    status: 'DELIVERED',
    errorCode: null,
    errorMessage: null,
    sentAt: ts('2026-06-19T08:28:00.000Z'),
    deliveredAt: ts('2026-06-19T08:29:30.000Z'),
    readAt: null,
    failedAt: null,
    createdAt: ts('2026-06-19T08:27:45.000Z'),
    updatedAt: ts('2026-06-19T08:29:30.000Z'),
  }),
  messageBase({
    id: '00000000-0000-4000-8000-000000000034',
    correlationId: 'corr-h1i2j3',
    recipientPhone: '+91 90000 11111',
    metaTemplateName: 'otp_login',
    metaMessageId: 'wamid.mock004',
    status: 'SENT',
    errorCode: null,
    errorMessage: null,
    sentAt: ts('2026-06-19T07:55:00.000Z'),
    deliveredAt: null,
    readAt: null,
    failedAt: null,
    createdAt: ts('2026-06-19T07:54:50.000Z'),
    updatedAt: ts('2026-06-19T07:55:00.000Z'),
  }),
  messageBase({
    id: '00000000-0000-4000-8000-000000000035',
    correlationId: 'corr-k4l5m6',
    recipientPhone: '+91 98765 43210',
    metaTemplateName: 'order_shipped_v2',
    metaMessageId: 'wamid.mock005',
    status: 'QUEUED',
    errorCode: null,
    errorMessage: null,
    sentAt: null,
    deliveredAt: null,
    readAt: null,
    failedAt: null,
    createdAt: ts('2026-06-19T07:30:00.000Z'),
    updatedAt: ts('2026-06-19T07:30:00.000Z'),
  }),
  messageBase({
    id: '00000000-0000-4000-8000-000000000036',
    correlationId: 'corr-n7o8p9',
    recipientPhone: '+91 87654 32109',
    metaTemplateName: 'appointment_reminder',
    metaMessageId: 'wamid.mock006',
    status: 'READ',
    errorCode: null,
    errorMessage: null,
    sentAt: ts('2026-06-18T18:00:00.000Z'),
    deliveredAt: ts('2026-06-18T18:01:00.000Z'),
    readAt: ts('2026-06-18T18:05:00.000Z'),
    failedAt: null,
    createdAt: ts('2026-06-18T17:59:30.000Z'),
    updatedAt: ts('2026-06-18T18:05:00.000Z'),
  }),
  messageBase({
    id: '00000000-0000-4000-8000-000000000037',
    correlationId: 'corr-q1r2s3',
    recipientPhone: '+91 76543 21098',
    metaTemplateName: 'festive_promo_june',
    metaMessageId: 'wamid.mock007',
    status: 'FAILED',
    errorCode: '132000',
    errorMessage: 'Template paused',
    sentAt: ts('2026-06-18T12:00:00.000Z'),
    deliveredAt: null,
    readAt: null,
    failedAt: ts('2026-06-18T12:00:05.000Z'),
    createdAt: ts('2026-06-18T11:59:50.000Z'),
    updatedAt: ts('2026-06-18T12:00:05.000Z'),
  }),
];

export function filterDevMockMessages(req: ListMessagesRequest): PaginatedResult<MessageSummaryDto> {
  let items = [...DEV_MOCK_MESSAGES];

  if (req.status) {
    items = items.filter((m) => m.status === req.status);
  }
  if (req.recipientPhone?.trim()) {
    const q = req.recipientPhone.trim().replace(/\s/g, '');
    items = items.filter((m) => m.recipientPhone.replace(/\s/g, '').includes(q));
  }
  if (req.metaTemplateName?.trim()) {
    const q = req.metaTemplateName.trim().toLowerCase();
    items = items.filter((m) => m.metaTemplateName?.toLowerCase().includes(q));
  }

  return paginateMockItems(items, req.page, req.limit);
}

export function getDevMockMessageDetail(messageId: string): MessageDetailDto | undefined {
  const summary = DEV_MOCK_MESSAGES.find((m) => m.id === messageId);
  if (!summary) return undefined;

  return {
    ...summary,
    components: { body: `Hi {{1}}, your order is on the way.` },
    bodyText: 'Hi Customer, your order is on the way.',
    pricingCategory: 'utility',
    pricingModel: 'PMP',
    billable: true,
    metaConversationId: 'conv-mock-001',
    templateVersionId: `ver-${summary.id}`,
    phoneNumber: {
      id: DEV_MOCK_PHONE_PRIMARY_ID,
      displayNumber: '+91 98765 00000',
      verifiedName: 'WhatsApp Ops Demo',
    },
  };
}

// ——— Events ———

export const DEV_MOCK_EVENTS: EventIngestDto[] = [
  {
    id: '00000000-0000-4000-8000-000000000040',
    organizationId: ORG_ID,
    correlationId: 'corr-a1b2c3',
    eventKey: 'order.shipped',
    idempotencyKey: 'idem-001',
    recipientPhone: '+91 98765 43210',
    status: 'PROCESSED',
    errorMessage: null,
    processedAt: ts('2026-06-19T09:41:12.000Z'),
    createdAt: ts('2026-06-19T09:41:10.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000041',
    organizationId: ORG_ID,
    correlationId: 'corr-g7h8i9',
    eventKey: 'payment.received',
    idempotencyKey: 'idem-002',
    recipientPhone: '+91 91234 56789',
    status: 'PROCESSED',
    errorMessage: null,
    processedAt: ts('2026-06-19T08:30:00.000Z'),
    createdAt: ts('2026-06-19T08:29:58.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000042',
    organizationId: ORG_ID,
    correlationId: 'corr-t1u2v3',
    eventKey: 'appointment.reminder',
    idempotencyKey: 'idem-003',
    recipientPhone: '+91 91234 56789',
    status: 'PROCESSED',
    errorMessage: null,
    processedAt: ts('2026-06-19T09:14:00.000Z'),
    createdAt: ts('2026-06-19T09:13:55.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000043',
    organizationId: ORG_ID,
    correlationId: 'corr-w4x5y6',
    eventKey: 'order.shipped',
    idempotencyKey: 'idem-004',
    recipientPhone: '+91 99887 76655',
    status: 'FAILED',
    errorMessage: 'No matching notification rule',
    processedAt: null,
    createdAt: ts('2026-06-19T08:53:00.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000044',
    organizationId: ORG_ID,
    correlationId: 'corr-z7a8b9',
    eventKey: 'user.signup',
    idempotencyKey: 'idem-005',
    recipientPhone: '+91 90000 11111',
    status: 'SKIPPED',
    errorMessage: 'Rule disabled',
    processedAt: ts('2026-06-19T07:00:00.000Z'),
    createdAt: ts('2026-06-19T06:59:58.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000045',
    organizationId: ORG_ID,
    correlationId: 'corr-c1d2e3',
    eventKey: 'payment.received',
    idempotencyKey: 'idem-006',
    recipientPhone: '+91 87654 32109',
    status: 'PROCESSING',
    errorMessage: null,
    processedAt: null,
    createdAt: ts('2026-06-19T07:45:00.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000046',
    organizationId: ORG_ID,
    correlationId: 'corr-f4g5h6',
    eventKey: 'order.shipped',
    idempotencyKey: 'idem-007',
    recipientPhone: '+91 76543 21098',
    status: 'RECEIVED',
    errorMessage: null,
    processedAt: null,
    createdAt: ts('2026-06-19T07:30:00.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000047',
    organizationId: ORG_ID,
    correlationId: 'corr-i7j8k9',
    eventKey: 'appointment.reminder',
    idempotencyKey: 'idem-008',
    recipientPhone: '+91 98765 43210',
    status: 'PROCESSED',
    errorMessage: null,
    processedAt: ts('2026-06-18T17:59:00.000Z'),
    createdAt: ts('2026-06-18T17:58:55.000Z'),
  },
];

export function filterDevMockEvents(req: ListEventsRequest): PaginatedResult<EventIngestDto> {
  let items = [...DEV_MOCK_EVENTS];

  if (req.status) {
    items = items.filter((e) => e.status === req.status);
  }
  if (req.eventKey?.trim()) {
    const q = req.eventKey.trim().toLowerCase();
    items = items.filter((e) => e.eventKey.toLowerCase().includes(q));
  }

  return paginateMockItems(items, req.page, req.limit);
}

// ——— Notification rules ———

export const DEV_MOCK_NOTIFICATION_RULES: NotificationRuleDto[] = [
  {
    id: '00000000-0000-4000-8000-000000000050',
    organizationId: ORG_ID,
    eventKey: 'order.shipped',
    name: 'Order shipped notification',
    version: 2,
    templateId: DEV_MOCK_TEMPLATES[0].id,
    templateVersionId: 'ver-tpl-001',
    phoneNumberId: DEV_MOCK_PHONE_PRIMARY_ID,
    variableMapping: { '1': 'customer_name', '2': 'tracking_id' },
    enabled: true,
    priority: 10,
    template: {
      id: DEV_MOCK_TEMPLATES[0].id,
      metaTemplateName: 'order_shipped_v2',
      metaStatus: 'APPROVED',
      language: 'en',
    },
    phoneNumber: {
      id: DEV_MOCK_PHONE_PRIMARY_ID,
      displayNumber: '+91 98765 00000',
      isDefault: true,
    },
    createdAt: ts('2026-03-15T10:00:00.000Z'),
    updatedAt: ts('2026-06-10T14:00:00.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000051',
    organizationId: ORG_ID,
    eventKey: 'appointment.reminder',
    name: 'Appointment reminder',
    version: 1,
    templateId: DEV_MOCK_TEMPLATES[1].id,
    templateVersionId: 'ver-tpl-002',
    phoneNumberId: DEV_MOCK_PHONE_PRIMARY_ID,
    variableMapping: { '1': 'appointment_time' },
    enabled: true,
    priority: 5,
    template: {
      id: DEV_MOCK_TEMPLATES[1].id,
      metaTemplateName: 'appointment_reminder',
      metaStatus: 'APPROVED',
      language: 'en',
    },
    phoneNumber: {
      id: DEV_MOCK_PHONE_PRIMARY_ID,
      displayNumber: '+91 98765 00000',
      isDefault: true,
    },
    createdAt: ts('2026-04-01T10:00:00.000Z'),
    updatedAt: ts('2026-05-20T09:00:00.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000052',
    organizationId: ORG_ID,
    eventKey: 'payment.received',
    name: 'Payment receipt',
    version: 1,
    templateId: DEV_MOCK_TEMPLATES[2].id,
    templateVersionId: 'ver-tpl-003',
    phoneNumberId: null,
    variableMapping: { '1': 'amount' },
    enabled: true,
    priority: 8,
    template: {
      id: DEV_MOCK_TEMPLATES[2].id,
      metaTemplateName: 'payment_receipt',
      metaStatus: 'APPROVED',
      language: 'en',
    },
    phoneNumber: null,
    createdAt: ts('2026-04-15T10:00:00.000Z'),
    updatedAt: ts('2026-04-15T10:00:00.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000053',
    organizationId: ORG_ID,
    eventKey: 'user.signup',
    name: 'Welcome message (disabled)',
    version: 1,
    templateId: DEV_MOCK_TEMPLATES[4].id,
    templateVersionId: 'ver-tpl-005',
    phoneNumberId: DEV_MOCK_PHONE_SECONDARY_ID,
    variableMapping: {},
    enabled: false,
    priority: 1,
    template: {
      id: DEV_MOCK_TEMPLATES[4].id,
      metaTemplateName: 'otp_login',
      metaStatus: 'APPROVED',
      language: 'en',
    },
    phoneNumber: {
      id: DEV_MOCK_PHONE_SECONDARY_ID,
      displayNumber: '+91 87654 00000',
      isDefault: false,
    },
    createdAt: ts('2026-05-01T10:00:00.000Z'),
    updatedAt: ts('2026-06-01T10:00:00.000Z'),
  },
];

export function filterDevMockNotificationRules(
  req: ListNotificationRulesRequest,
): PaginatedResult<NotificationRuleDto> {
  let items = [...DEV_MOCK_NOTIFICATION_RULES];

  if (req.enabled === 'true') {
    items = items.filter((r) => r.enabled);
  } else if (req.enabled === 'false') {
    items = items.filter((r) => !r.enabled);
  }
  if (req.eventKey?.trim()) {
    const q = req.eventKey.trim().toLowerCase();
    items = items.filter((r) => r.eventKey.toLowerCase().includes(q));
  }
  if (req.templateId) {
    items = items.filter((r) => r.templateId === req.templateId);
  }

  return paginateMockItems(items, req.page, req.limit);
}

export function getDevMockNotificationRule(ruleId: string): NotificationRuleDto | undefined {
  return DEV_MOCK_NOTIFICATION_RULES.find((r) => r.id === ruleId);
}

// ——— API keys ———

export const DEV_MOCK_API_KEYS: ApiKeySummaryDto[] = [
  {
    id: '00000000-0000-4000-8000-000000000060',
    name: 'Production integrator',
    keyPrefix: 'td_live_abc',
    scopes: ['events:write', 'messages:write'],
    lastUsedAt: ts('2026-06-19T08:00:00.000Z'),
    expiresAt: null,
    revokedAt: null,
    createdAt: ts('2026-01-15T10:00:00.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000061',
    name: 'Staging sandbox',
    keyPrefix: 'td_test_xyz',
    scopes: ['events:write'],
    lastUsedAt: ts('2026-06-18T16:30:00.000Z'),
    expiresAt: ts('2026-12-31T23:59:59.000Z'),
    revokedAt: null,
    createdAt: ts('2026-03-01T10:00:00.000Z'),
  },
  {
    id: '00000000-0000-4000-8000-000000000062',
    name: 'Legacy webhook (revoked)',
    keyPrefix: 'td_live_old',
    scopes: ['events:write'],
    lastUsedAt: ts('2026-02-10T12:00:00.000Z'),
    expiresAt: null,
    revokedAt: ts('2026-05-01T10:00:00.000Z'),
    createdAt: ts('2025-11-01T10:00:00.000Z'),
  },
];

// ——— WhatsApp ———

export const DEV_MOCK_WHATSAPP_ACCOUNTS: WhatsAppAccountDto[] = [
  {
    id: DEV_MOCK_WHATSAPP_ACCOUNT_ID,
    organizationId: ORG_ID,
    metaWabaId: '123456789012345',
    name: 'WhatsApp Ops Demo WABA',
    status: 'ACTIVE',
    lastSyncedAt: ts('2026-06-19T07:00:00.000Z'),
    lastError: null,
    phoneNumberCount: 2,
    createdAt: ts('2026-01-05T10:00:00.000Z'),
    updatedAt: ts('2026-06-19T07:00:00.000Z'),
  },
];

export const DEV_MOCK_PHONE_NUMBERS: PhoneNumberDto[] = [
  {
    id: DEV_MOCK_PHONE_PRIMARY_ID,
    whatsAppAccountId: DEV_MOCK_WHATSAPP_ACCOUNT_ID,
    metaPhoneNumberId: 'meta-phone-001',
    displayNumber: '+91 98765 00000',
    verifiedName: 'WhatsApp Ops Demo',
    qualityRating: 'GREEN',
    messagingTier: 'TIER_10K',
    status: 'ACTIVE',
    isDefault: true,
    lastHealthCheckAt: ts('2026-06-19T06:00:00.000Z'),
    createdAt: ts('2026-01-05T10:00:00.000Z'),
    updatedAt: ts('2026-06-19T06:00:00.000Z'),
  },
  {
    id: DEV_MOCK_PHONE_SECONDARY_ID,
    whatsAppAccountId: DEV_MOCK_WHATSAPP_ACCOUNT_ID,
    metaPhoneNumberId: 'meta-phone-002',
    displayNumber: '+91 87654 00000',
    verifiedName: 'WhatsApp Ops Support',
    qualityRating: 'YELLOW',
    messagingTier: 'TIER_1K',
    status: 'ACTIVE',
    isDefault: false,
    lastHealthCheckAt: ts('2026-06-18T12:00:00.000Z'),
    createdAt: ts('2026-02-01T10:00:00.000Z'),
    updatedAt: ts('2026-06-18T12:00:00.000Z'),
  },
];

export function getDevMockPhoneNumbers(accountId: string): PhoneNumberDto[] {
  return DEV_MOCK_PHONE_NUMBERS.filter((p) => p.whatsAppAccountId === accountId);
}
