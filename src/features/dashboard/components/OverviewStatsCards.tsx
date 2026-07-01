import { Activity, Bell, Eye, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineError } from '@/components/shared/InlineError';
import { formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { DashboardOverviewDto } from '@/features/dashboard/types';
import type { LucideIcon } from 'lucide-react';

type OverviewStatsCardsProps = {
  data: DashboardOverviewDto | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
};

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  tone?: 'default' | 'success' | 'info' | 'warning';
};

const toneStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

function StatCard({ title, value, subtitle, icon: Icon, tone = 'default' }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
              {value}
            </p>
            {subtitle ? <p className="text-xs font-medium text-muted-foreground">{subtitle}</p> : null}
          </div>
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              toneStyles[tone],
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MessageStatusBreakdown({ data }: { data: DashboardOverviewDto }) {
  const delivered = data.messages.byStatus.DELIVERED ?? 0;
  const read = data.messages.byStatus.READ ?? 0;
  const failed = data.messages.byStatus.FAILED ?? 0;
  const sent = data.messages.byStatus.SENT ?? 0;
  const total = data.messages.total || 1;

  const segments = [
    { label: 'Read', count: read, className: 'bg-emerald-500' },
    { label: 'Delivered', count: delivered, className: 'bg-sky-500' },
    { label: 'Sent', count: sent, className: 'bg-slate-400' },
    { label: 'Failed', count: failed, className: 'bg-destructive' },
  ].filter((segment) => segment.count > 0);

  return (
    <Card className="shadow-sm sm:col-span-2 lg:col-span-4">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-foreground">Message status breakdown</p>
          <p className="text-xs font-medium text-muted-foreground">
            {data.messages.total.toLocaleString()} total in period
          </p>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
          {segments.map((segment) => (
            <div
              key={segment.label}
              className={cn('h-full', segment.className)}
              style={{ width: `${(segment.count / total) * 100}%` }}
              title={`${segment.label}: ${segment.count.toLocaleString()}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center gap-2 text-xs font-medium">
              <span className={cn('h-2 w-2 rounded-full', segment.className)} />
              <span className="text-foreground">{segment.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {segment.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewStatsCards({
  data,
  isLoading,
  isError,
  error,
  onRetry,
}: OverviewStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[7.5rem] rounded-xl" />
        ))}
        <Skeleton className="h-28 rounded-xl sm:col-span-2 lg:col-span-4" />
      </div>
    );
  }

  if (isError) {
    return <InlineError error={error} onRetry={onRetry} />;
  }

  if (!data) return null;

  const failedMessages = data.messages.byStatus.FAILED ?? 0;
  const processedEvents = data.events.byStatus.PROCESSED ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Messages sent"
        value={data.messages.total.toLocaleString()}
        subtitle="Outbound WhatsApp messages"
        icon={Send}
        tone="info"
      />
      <StatCard
        title="Delivery rate"
        value={formatPercent(data.messages.deliveryRate)}
        subtitle={`${failedMessages.toLocaleString()} failed`}
        icon={Activity}
        tone="success"
      />
      <StatCard
        title="Read rate"
        value={formatPercent(data.messages.readRate)}
        subtitle="Of delivered messages"
        icon={Eye}
        tone="default"
      />
      <StatCard
        title="Events ingested"
        value={data.events.total.toLocaleString()}
        subtitle={`${processedEvents.toLocaleString()} processed · ${data.executions.total.toLocaleString()} runs`}
        icon={Bell}
        tone="warning"
      />
      <MessageStatusBreakdown data={data} />
    </div>
  );
}
