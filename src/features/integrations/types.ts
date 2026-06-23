export type OutboundWebhookEventType =
  | 'message.accepted'
  | 'message.sent'
  | 'message.delivered'
  | 'message.read'
  | 'message.failed';

export interface OutboundWebhookConfig {
  url: string;
  enabled: boolean;
  hasSecret: boolean;
  events: OutboundWebhookEventType[];
  updatedAt: string | null;
}

export interface UpsertOutboundWebhookRequest {
  url: string;
  secret?: string;
  enabled: boolean;
}
