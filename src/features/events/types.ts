export const EVENT_INGEST_STATUSES = [
  'RECEIVED',
  'PROCESSING',
  'PROCESSED',
  'FAILED',
  'SKIPPED',
] as const;

export type EventIngestStatus = (typeof EVENT_INGEST_STATUSES)[number];

export type EventIngestDto = {
  id: string;
  organizationId: string;
  correlationId: string;
  eventKey: string;
  idempotencyKey: string;
  recipientPhone: string;
  status: EventIngestStatus;
  errorMessage: string | null;
  processedAt: string | null;
  createdAt: string;
};

export type ListEventsRequest = {
  page: number;
  limit: number;
  status?: EventIngestStatus;
  eventKey?: string;
};
