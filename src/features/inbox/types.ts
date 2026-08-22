export type ConversationDirection = 'OUTBOUND' | 'INBOUND';

export type ConversationSummaryDto = {
  id: string;
  phoneNumberId: string;
  contactPhone: string;
  lastMessageAt: string;
  lastMessagePreview: string | null;
  lastMessageDirection: ConversationDirection | null;
  unreadCount: number;
  canSendFreeText: boolean;
};

export type ConversationThreadMessageDto = {
  id: string;
  direction: ConversationDirection;
  type: string;
  status: string;
  bodyText: string | null;
  metaTemplateName: string | null;
  components: unknown;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
};

export type ListConversationsRequest = {
  page: number;
  limit: number;
  unreadOnly?: boolean;
};

export type ListConversationThreadRequest = {
  page: number;
  limit: number;
};

export type SendConversationReplyRequest =
  | { type: 'text'; body: string; idempotencyKey: string }
  | {
      type: 'template';
      template: string;
      language?: string;
      variables?: Record<string, string> | string[];
      idempotencyKey: string;
    };

export type SendConversationReplyResult = {
  messageId: string;
  duplicate: boolean;
  status: string;
};
