import { put } from '@/lib/api-client';
import type {
  OutboundWebhookConfig,
  UpsertOutboundWebhookRequest,
} from '@/features/integrations/types';

export async function upsertOutboundWebhook(
  req: UpsertOutboundWebhookRequest,
): Promise<OutboundWebhookConfig> {
  return put<OutboundWebhookConfig, UpsertOutboundWebhookRequest>('/webhook-subscriptions', req);
}
