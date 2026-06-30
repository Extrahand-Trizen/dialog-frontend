import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { InlineError } from '@/components/shared/InlineError';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDateTime } from '@/lib/format';
import type { RecentActivityItemDto } from '@/features/dashboard/types';

type RecentActivityFeedProps = {
  items: RecentActivityItemDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
};

function ActivityRow({ item }: { item: RecentActivityItemDto }) {
  const label =
    item.type === 'message'
      ? item.metaTemplateName ?? 'Template message'
      : item.eventKey;

  return (
    <div className="flex items-start justify-between gap-4 border-b py-3 last:border-0">
      <div className="min-w-0 space-y-1">
        <p className="truncate text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          {item.recipientPhone} · {item.type}
        </p>
        {item.correlationId ? (
          <p className="font-mono text-xs text-muted-foreground">
            {item.correlationId}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <StatusBadge status={item.status} />
        <span className="text-xs text-muted-foreground">{formatDateTime(item.occurredAt)}</span>
      </div>
    </div>
  );
}

export function RecentActivityFeed({
  items,
  isLoading,
  isError,
  error,
  onRetry,
}: RecentActivityFeedProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12" />
            ))}
          </div>
        ) : isError ? (
          <InlineError error={error} onRetry={onRetry} />
        ) : items && items.length > 0 ? (
          items.map((item) => <ActivityRow key={`${item.type}-${item.id}`} item={item} />)
        ) : (
          <EmptyState
            title="No recent activity"
            description="Messages and events will appear here as they are processed."
          />
        )}
      </CardContent>
    </Card>
  );
}
