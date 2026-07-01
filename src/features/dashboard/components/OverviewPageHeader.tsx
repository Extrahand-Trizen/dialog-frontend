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
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-base font-semibold text-foreground">Performance summary</h2>
            <p className="text-sm text-muted-foreground">
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
