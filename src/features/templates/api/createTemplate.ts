import { post } from '@/lib/api-client';
import type { CreateTemplateRequest, TemplateDetailDto } from '@/features/templates/types';

export async function createTemplate(req: CreateTemplateRequest): Promise<TemplateDetailDto> {
  return post<TemplateDetailDto, CreateTemplateRequest>('/templates', req);
}
