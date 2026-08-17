import { post } from '@/lib/api-client';
import type { CopyTemplatesRequest, CopyTemplatesResponse } from '@/features/templates/types';

export async function copyTemplates(req: CopyTemplatesRequest): Promise<CopyTemplatesResponse> {
  return post<CopyTemplatesResponse, CopyTemplatesRequest>('/templates/copy', req);
}
