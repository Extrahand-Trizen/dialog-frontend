import { AlertCircle, Check, CheckCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type MessageStatusTicksProps = {
  status: string;
  className?: string;
};

/** WhatsApp-style status ticks for inside a chat bubble — legible on both bubble colors. */
export function MessageStatusTicks({ status, className }: MessageStatusTicksProps) {
  switch (status) {
    case 'QUEUED':
      return <Clock className={cn('size-3.5 opacity-80', className)} aria-label="Queued" />;
    case 'SENT':
      return <Check className={cn('size-3.5', className)} aria-label="Sent" />;
    case 'DELIVERED':
      return <CheckCheck className={cn('size-3.5', className)} aria-label="Delivered" />;
    case 'READ':
      return (
        <CheckCheck
          className={cn('size-3.5 text-sky-400 dark:text-sky-300', className)}
          aria-label="Read"
        />
      );
    case 'FAILED':
      return (
        <AlertCircle
          className={cn('size-3.5 text-red-200 dark:text-red-300', className)}
          aria-label="Failed"
        />
      );
    default:
      return null;
  }
}
