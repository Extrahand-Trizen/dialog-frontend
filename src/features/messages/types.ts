export const MESSAGE_STATUSES = ['QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED'] as const;
export type MessageListStatus = (typeof MESSAGE_STATUSES)[number];

export type MessageSummaryDto = {
  id: string;
  organizationId: string;
  phoneNumberId: string;
  correlationId: string | null;
  recipientPhone: string;
  type: string;
  metaTemplateName: string | null;
  metaMessageId: string | null;
  status: MessageListStatus;
  errorCode: string | null;
  errorMessage: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MessageDetailDto = MessageSummaryDto & {
  components: unknown;
  bodyText: string | null;
  pricingCategory: string | null;
  pricingModel: string | null;
  billable: boolean | null;
  metaConversationId: string | null;
  templateVersionId: string | null;
  phoneNumber: {
    id: string;
    displayNumber: string;
    verifiedName: string | null;
  };
};

export type ListMessagesRequest = {
  page: number;
  limit: number;
  status?: MessageListStatus;
  recipientPhone?: string;
  metaTemplateName?: string;
};
