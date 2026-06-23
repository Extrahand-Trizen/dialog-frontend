import { get } from '@/lib/api-client';
import type { OutboundWebhookConfig } from '@/features/integrations/types';

export async function getOutboundWebhook(): Promise<OutboundWebhookConfig> {
  return get<OutboundWebhookConfig>('/webhook-subscriptions');
}
