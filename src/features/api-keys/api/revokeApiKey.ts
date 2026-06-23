import { post } from '@/lib/api-client';
import type { ApiKeySummaryDto } from '@/features/api-keys/types';

export type RevokeApiKeyRequest = {
  apiKeyId: string;
};

export async function revokeApiKey(req: RevokeApiKeyRequest): Promise<ApiKeySummaryDto> {
  return post<ApiKeySummaryDto>(`/api-keys/${req.apiKeyId}/revoke`);
}
