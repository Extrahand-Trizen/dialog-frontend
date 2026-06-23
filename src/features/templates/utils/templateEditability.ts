import type { MetaTemplateStatus } from '@/features/templates/types';

const NON_EDITABLE_STATUSES: ReadonlySet<MetaTemplateStatus> = new Set(['DELETED', 'DISABLED']);

export function canEditTemplate(metaStatus: MetaTemplateStatus, metaTemplateId: string | null): boolean {
  return Boolean(metaTemplateId) && !NON_EDITABLE_STATUSES.has(metaStatus);
}
