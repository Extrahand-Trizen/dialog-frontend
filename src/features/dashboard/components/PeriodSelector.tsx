import { cn } from '@/lib/utils';
import { DASHBOARD_PERIODS, type DashboardPeriod } from '@/features/dashboard/types';

const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
};

type PeriodSelectorProps = {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
};

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div
      className="inline-flex rounded-lg bg-muted p-1"
      role="group"
      aria-label="Time period"
    >
      {DASHBOARD_PERIODS.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === period
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {PERIOD_LABELS[period]}
        </button>
      ))}
    </div>
  );
}
