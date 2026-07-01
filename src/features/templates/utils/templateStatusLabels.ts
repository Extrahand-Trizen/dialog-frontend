import type { MetaTemplateStatus } from '@/features/templates/types';

const TEMPLATE_STATUS_LABELS: Record<MetaTemplateStatus, string> = {
  PENDING: 'Under review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PAUSED: 'Paused',
  DISABLED: 'Disabled',
  DELETED: 'Deleted',
  UNKNOWN: 'Unknown',
};

export function getTemplateStatusLabel(status: MetaTemplateStatus | string): string {
  return TEMPLATE_STATUS_LABELS[status as MetaTemplateStatus] ?? status;
}
