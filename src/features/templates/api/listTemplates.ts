import { getPaginated } from '@/lib/api-client';
import { toApiQueryParams } from '@/lib/query-params';
import type { ListTemplatesRequest, TemplateSummaryDto } from '@/features/templates/types';

export async function listTemplates(req: ListTemplatesRequest) {
  return getPaginated<TemplateSummaryDto>(
    '/templates',
    toApiQueryParams(req as Record<string, string | number | undefined>),
  );
}
