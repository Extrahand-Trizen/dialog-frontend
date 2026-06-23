import { get } from '@/lib/api-client';
import type { DashboardOverviewDto, DashboardPeriod } from '@/features/dashboard/types';

export type GetOverviewRequest = {
  period: DashboardPeriod;
};

export async function getOverview(req: GetOverviewRequest): Promise<DashboardOverviewDto> {
  return get<DashboardOverviewDto>('/dashboard/overview', { period: req.period });
}
