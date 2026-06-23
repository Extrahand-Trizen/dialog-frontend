import { Activity, Bell, Eye, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  iconClassName?: string;
};

function StatCard({ title, value, subtitle, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10',
            iconClassName,
          )}
        >
          <Icon className="h-4 w-4 text-primary" aria-hidden />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
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
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <InlineError error={error} onRetry={onRetry} />;
  }

  if (!data) return null;

  const failedMessages = data.messages.byStatus.FAILED ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Messages sent" value={data.messages.total.toLocaleString()} icon={Send} />
      <StatCard
        title="Delivery rate"
        value={formatPercent(data.messages.deliveryRate)}
        subtitle={`${failedMessages} failed`}
        icon={Activity}
      />
      <StatCard
        title="Read rate"
        value={formatPercent(data.messages.readRate)}
        icon={Eye}
      />
      <StatCard
        title="Events ingested"
        value={data.events.total.toLocaleString()}
        icon={Bell}
      />
    </div>
  );
}
