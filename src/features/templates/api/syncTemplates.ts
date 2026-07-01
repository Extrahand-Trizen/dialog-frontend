import { post } from '@/lib/api-client';
import type { SyncTemplatesRequest, SyncTemplatesResponse } from '@/features/templates/types';

export async function syncTemplates(
  req: SyncTemplatesRequest,
): Promise<SyncTemplatesResponse> {
  return post<SyncTemplatesResponse, SyncTemplatesRequest>('/templates/sync', req);
}
