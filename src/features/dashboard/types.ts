export const DASHBOARD_PERIODS = ['7d', '30d', '90d'] as const;
export type DashboardPeriod = (typeof DASHBOARD_PERIODS)[number];

export type StatusCountMap = Record<string, number>;

export type DashboardOverviewDto = {
  period: DashboardPeriod;
  periodStart: string;
  messages: {
    total: number;
    byStatus: StatusCountMap;
    deliveryRate: number | null;
    readRate: number | null;
  };
  events: {
    total: number;
    byStatus: StatusCountMap;
  };
  executions: {
    total: number;
    byStatus: StatusCountMap;
  };
};

export type RecentActivityItemDto =
  | {
      type: 'message';
      id: string;
      occurredAt: string;
      status: string;
      recipientPhone: string;
      metaTemplateName: string | null;
      correlationId: string | null;
    }
  | {
      type: 'event';
      id: string;
      occurredAt: string;
      status: string;
      eventKey: string;
      recipientPhone: string;
      correlationId: string;
    };
