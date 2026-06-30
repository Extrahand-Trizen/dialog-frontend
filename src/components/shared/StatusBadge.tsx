import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  QUEUED: 'secondary',
  SENT: 'default',
  DELIVERED: 'default',
  READ: 'default',
  FAILED: 'destructive',
  RECEIVED: 'secondary',
  PROCESSING: 'outline',
  PROCESSED: 'default',
  SKIPPED: 'outline',
  APPROVED: 'default',
  PENDING: 'outline',
  REJECTED: 'destructive',
  PAUSED: 'secondary',
  DISABLED: 'secondary',
  DELETED: 'destructive',
  ACTIVE: 'default',
  ERROR: 'destructive',
  DISCONNECTED: 'secondary',
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = STATUS_VARIANTS[status] ?? 'outline';
  return (
    <Badge variant={variant} className={cn('font-mono text-xs', className)}>
      {status}
    </Badge>
  );
}
