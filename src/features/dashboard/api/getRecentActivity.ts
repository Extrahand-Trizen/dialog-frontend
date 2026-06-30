import { get } from '@/lib/api-client';
import type { RecentActivityItemDto } from '@/features/dashboard/types';

export type GetRecentActivityRequest = {
  limit: number;
};

export async function getRecentActivity(
  req: GetRecentActivityRequest,
): Promise<RecentActivityItemDto[]> {
  return get<RecentActivityItemDto[]>('/dashboard/recent-activity', { limit: req.limit });
}
