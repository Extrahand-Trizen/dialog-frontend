export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: (period: string) => [...dashboardKeys.all, 'overview', period] as const,
  recentActivity: (limit: number) => [...dashboardKeys.all, 'recent-activity', limit] as const,
};
