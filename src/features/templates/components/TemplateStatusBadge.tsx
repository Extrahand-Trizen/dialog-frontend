import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MetaTemplateStatus } from '@/features/templates/types';
import { getTemplateStatusLabel } from '@/features/templates/utils/templateStatusLabels';

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  APPROVED: 'default',
  PENDING: 'outline',
  REJECTED: 'destructive',
  PAUSED: 'secondary',
  DISABLED: 'secondary',
  DELETED: 'destructive',
  UNKNOWN: 'outline',
};

type TemplateStatusBadgeProps = {
  status: MetaTemplateStatus | string;
  className?: string;
};

export function TemplateStatusBadge({ status, className }: TemplateStatusBadgeProps) {
  const variant = STATUS_VARIANTS[status] ?? 'outline';
  return (
    <Badge variant={variant} className={cn('text-xs font-medium', className)}>
      {getTemplateStatusLabel(status)}
    </Badge>
  );
}
