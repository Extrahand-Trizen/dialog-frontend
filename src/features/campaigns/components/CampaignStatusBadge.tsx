import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function CampaignStatusBadge({
  status,
  className,
}: {
  status: 'sending' | 'completed' | string;
  className?: string;
}) {
  const completed = status === 'completed';
  return (
    <Badge
      variant="secondary"
      className={cn(
        'h-5 border-0 px-2 text-[11px] font-medium capitalize shadow-none',
        completed ? 'bg-emerald-50 text-emerald-800' : 'bg-sky-50 text-sky-800',
        className,
      )}
    >
      {completed ? 'Completed' : 'Sending'}
    </Badge>
  );
}

const RECIPIENT_LABEL: Record<string, string> = {
  pending: 'Pending',
  sending: 'Sending',
  queued: 'Queued',
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  failed: 'Failed',
  duplicate: 'Duplicate',
};

export function RecipientStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const delivered = status === 'sent' || status === 'delivered' || status === 'read' || status === 'duplicate';
  const failed = status === 'failed';
  return (
    <Badge
      variant="secondary"
      className={cn(
        'h-5 border-0 px-2 text-[11px] font-medium shadow-none',
        delivered
          ? 'bg-emerald-50 text-emerald-800'
          : failed
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {RECIPIENT_LABEL[status] ?? status}
    </Badge>
  );
}
