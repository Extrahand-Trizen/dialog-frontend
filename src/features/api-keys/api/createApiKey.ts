import { post } from '@/lib/api-client';
import type { CreateApiKeyRequest, CreateApiKeyResponse } from '@/features/api-keys/types';

export async function createApiKey(req: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
  return post<CreateApiKeyResponse, CreateApiKeyRequest>('/api-keys', req);
}
