import { get } from '@/lib/api-client';
import type { ApiKeySummaryDto } from '@/features/api-keys/types';

export async function listApiKeys(): Promise<ApiKeySummaryDto[]> {
  return get<ApiKeySummaryDto[]>('/api-keys');
}
