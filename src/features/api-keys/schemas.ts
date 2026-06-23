import { z } from 'zod';
import { API_KEY_SCOPES } from '@/features/api-keys/types';

export const createApiKeyFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  scopes: z.array(z.enum(API_KEY_SCOPES)).min(1, 'Select at least one scope'),
  expiresAt: z.string().optional(),
});

export type CreateApiKeyFormValues = z.infer<typeof createApiKeyFormSchema>;

export const SCOPE_LABELS: Record<(typeof API_KEY_SCOPES)[number], string> = {
  'events:write': 'Ingest events (legacy)',
  'messages:write': 'Send messages',
  'templates:read': 'Read templates',
};
