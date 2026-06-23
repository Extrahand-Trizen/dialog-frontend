import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineError } from '@/components/shared/InlineError';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDateTime } from '@/lib/format';
import type { MessageDetailDto } from '@/features/messages/types';

type MessageDetailDialogProps = {
  messageId: string | null;
  data: MessageDetailDto | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onClose: () => void;
};

export function MessageDetailDialog({
  messageId,
  data,
  isLoading,
  isError,
  error,
  onClose,
}: MessageDetailDialogProps) {
  return (
    <Dialog open={!!messageId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Message details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Skeleton className="h-40" />
        ) : isError ? (
          <InlineError error={error} />
        ) : data ? (
          <div className="space-y-4 text-sm">
            <StatusBadge status={data.status} />
            <dl className="grid gap-2">
              <div>
                <dt className="text-muted-foreground">Recipient</dt>
                <dd>{data.recipientPhone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Template</dt>
                <dd>{data.metaTemplateName ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">From</dt>
                <dd>{data.phoneNumber.displayNumber}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Correlation ID</dt>
                <dd className="font-mono text-xs">{data.correlationId ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sent</dt>
                <dd>{formatDateTime(data.sentAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Delivered</dt>
                <dd>{formatDateTime(data.deliveredAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Read</dt>
                <dd>{formatDateTime(data.readAt)}</dd>
              </div>
            </dl>
            {data.errorMessage ? (
              <p className="text-destructive">
                {data.errorCode ? `${data.errorCode}: ` : ''}
                {data.errorMessage}
              </p>
            ) : null}
            {data.bodyText ? (
              <p className="rounded-md bg-muted p-3">{data.bodyText}</p>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
