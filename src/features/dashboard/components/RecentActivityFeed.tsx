import { Link } from 'react-router-dom';
import { ArrowRight, Bell, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { InlineError } from '@/components/shared/InlineError';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { RecentActivityItemDto } from '@/features/dashboard/types';

type RecentActivityFeedProps = {
  items: RecentActivityItemDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
};

function ActivityRow({ item }: { item: RecentActivityItemDto }) {
  const isMessage = item.type === 'message';
  const label = isMessage
    ? item.metaTemplateName ?? 'Template message'
    : item.eventKey;

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/40">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          isMessage ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        )}
      >
        {isMessage ? (
          <MessageSquare className="h-4 w-4" strokeWidth={2.25} />
        ) : (
          <Bell className="h-4 w-4" strokeWidth={2.25} />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{label}</p>
          <Badge variant="outline" className="text-[10px] font-medium uppercase">
            {item.type}
          </Badge>
        </div>
        <p className="truncate text-xs font-medium text-muted-foreground">{item.recipientPhone}</p>
        {item.correlationId ? (
          <p className="truncate font-mono text-[11px] text-muted-foreground">{item.correlationId}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusBadge status={item.status} />
        <span className="text-xs font-medium text-muted-foreground">
          {formatDateTime(item.occurredAt)}
        </span>
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold text-foreground">Recent activity</CardTitle>
          <p className="text-sm text-muted-foreground">Latest messages and ingested events</p>
        </div>
        <Button variant="ghost" size="sm" asChild className="shrink-0 text-foreground">
          <Link to="/messages">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-[4.5rem] rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <InlineError error={error} onRetry={onRetry} />
        ) : items && items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <ActivityRow key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>
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
