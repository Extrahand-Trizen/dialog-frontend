import { patch } from '@/lib/api-client';
import type { TemplateDetailDto, UpdateTemplateRequest } from '@/features/templates/types';

export async function updateTemplate(
  templateId: string,
  req: UpdateTemplateRequest,
): Promise<TemplateDetailDto> {
  return patch<TemplateDetailDto, UpdateTemplateRequest>(`/templates/${templateId}`, req);
}
