import { get } from '@/lib/api-client';
import type { TemplateDetailDto } from '@/features/templates/types';

export type GetTemplateRequest = {
  templateId: string;
};

export async function getTemplate(req: GetTemplateRequest): Promise<TemplateDetailDto> {
  return get<TemplateDetailDto>(`/templates/${req.templateId}`);
}
