import { post } from '@/lib/api-client';
import type { DeleteTemplatesRequest, DeleteTemplatesResponse } from '@/features/templates/types';

export async function deleteTemplates(req: DeleteTemplatesRequest): Promise<DeleteTemplatesResponse> {
  return post<DeleteTemplatesResponse, DeleteTemplatesRequest>('/templates/delete', req);
}
