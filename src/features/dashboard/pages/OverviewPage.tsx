import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OverviewPageHeader } from '@/features/dashboard/components/OverviewPageHeader';
import { OverviewStatsCards } from '@/features/dashboard/components/OverviewStatsCards';
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed';
import { RECENT_ACTIVITY_LIMIT } from '@/features/dashboard/constants';
import { getOverview } from '@/features/dashboard/api/getOverview';
import { getRecentActivity } from '@/features/dashboard/api/getRecentActivity';
import { dashboardKeys } from '@/features/dashboard/queryKeys';
import type { DashboardPeriod } from '@/features/dashboard/types';
import { ListPageShell } from '@/components/shared/ListPageLayout';
import {
  DEV_MOCK_RECENT_ACTIVITY,
  getDevMockOverview,
} from '@/config/dev-mock-data';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';

export function OverviewPage() {
  const [period, setPeriod] = useState<DashboardPeriod>('30d');
  const useMockData = isDevMockAuthEnabled();

  const overviewQuery = useQuery({
    queryKey: dashboardKeys.overview(period),
    queryFn: () => getOverview({ period }),
    enabled: !useMockData,
  });

  const activityQuery = useQuery({
    queryKey: dashboardKeys.recentActivity(RECENT_ACTIVITY_LIMIT),
    queryFn: () => getRecentActivity({ limit: RECENT_ACTIVITY_LIMIT }),
    enabled: !useMockData,
  });

  const overviewData = useMockData ? getDevMockOverview(period) : overviewQuery.data;
  const activityData = useMockData ? DEV_MOCK_RECENT_ACTIVITY : activityQuery.data;

  return (
    <ListPageShell>
      <OverviewPageHeader
        period={period}
        onPeriodChange={setPeriod}
        periodStart={overviewData?.periodStart}
      />

      <OverviewStatsCards
        data={overviewData}
        isLoading={!useMockData && overviewQuery.isLoading}
        isError={!useMockData && overviewQuery.isError}
        error={overviewQuery.error}
        onRetry={() => void overviewQuery.refetch()}
      />

      <RecentActivityFeed
        items={activityData}
        isLoading={!useMockData && activityQuery.isLoading}
        isError={!useMockData && activityQuery.isError}
        error={activityQuery.error}
        onRetry={() => void activityQuery.refetch()}
      />
    </ListPageShell>
  );
}
