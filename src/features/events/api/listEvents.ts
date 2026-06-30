import { getPaginated } from '@/lib/api-client';
import { toApiQueryParams } from '@/lib/query-params';
import type { EventIngestDto, ListEventsRequest } from '@/features/events/types';

export async function listEvents(req: ListEventsRequest) {
  return getPaginated<EventIngestDto>(
    '/dashboard/events',
    toApiQueryParams(req as Record<string, string | number | undefined>),
  );
}
