export const integrationKeys = {
  all: ['integrations'] as const,
  outboundWebhook: () => [...integrationKeys.all, 'outbound-webhook'] as const,
};
