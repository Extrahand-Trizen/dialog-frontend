import { BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PeriodSelector } from '@/features/dashboard/components/PeriodSelector';
import type { DashboardPeriod } from '@/features/dashboard/types';

const PERIOD_SUMMARY: Record<DashboardPeriod, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
};

type OverviewPageHeaderProps = {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  periodStart?: string;
};

export function OverviewPageHeader({
  period,
  onPeriodChange,
  periodStart,
}: OverviewPageHeaderProps) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="size-4" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Performance summary
            </h2>
            <p className="text-xs text-muted-foreground">
              {PERIOD_SUMMARY[period]}
              {periodStart
                ? ` · since ${new Date(periodStart).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}`
                : ''}
            </p>
          </div>
        </div>
        <PeriodSelector value={period} onChange={onPeriodChange} />
      </CardContent>
    </Card>
  );
}
