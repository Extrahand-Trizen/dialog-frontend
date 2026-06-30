import { post } from '@/lib/api-client';
import type {
  EnqueueTemplateSyncResponse,
  SyncTemplatesRequest,
} from '@/features/templates/types';

export async function syncTemplates(
  req: SyncTemplatesRequest,
): Promise<EnqueueTemplateSyncResponse> {
  return post<EnqueueTemplateSyncResponse, SyncTemplatesRequest>('/templates/sync', req);
}
