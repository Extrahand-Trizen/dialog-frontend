import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { EmptyState } from '@/components/shared/EmptyState';

import { FilterPanel, ListPageShell, TablePanel } from '@/components/shared/ListPageLayout';

import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';

import { TablePagination } from '@/components/shared/TablePagination';

import { TableSkeleton } from '@/components/shared/TableSkeleton';

import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { useTableParams } from '@/hooks/use-table-params';

import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';

import { filterDevMockEvents } from '@/config/dev-mock-data';

import { listEvents } from '@/features/events/api/listEvents';

import { EventsFilters } from '@/features/events/components/EventsFilters';

import { EventsTable } from '@/features/events/components/EventsTable';

import { eventKeys } from '@/features/events/queryKeys';

import type { EventIngestStatus } from '@/features/events/types';



const EVENT_FILTER_DEFAULTS = {

  status: undefined as EventIngestStatus | undefined,

  eventKey: undefined as string | undefined,

};



export function EventsPage() {

  const useMockData = isDevMockAuthEnabled();

  const { params, setParams, resetPage } = useTableParams(EVENT_FILTER_DEFAULTS);

  const [eventKeyInput, setEventKeyInput] = useState(params.eventKey ?? '');

  const debouncedEventKey = useDebouncedValue(eventKeyInput);



  useEffect(() => {

    resetPage();

    setParams({ eventKey: debouncedEventKey || undefined });

  }, [debouncedEventKey, resetPage, setParams]);



  const queryParams = useMemo(

    () => ({

      page: params.page,

      limit: params.limit,

      status: params.status,

      eventKey: params.eventKey,

    }),

    [params],

  );



  const eventsQuery = useQuery({

    queryKey: eventKeys.list(queryParams),

    queryFn: () => listEvents(queryParams),

    enabled: !useMockData,

    placeholderData: (prev) => prev,

  });



  const listData = useMockData ? filterDevMockEvents(queryParams) : eventsQuery.data;



  return (

    <ListPageShell>

      <FilterPanel>

        <EventsFilters

          eventKey={eventKeyInput}

          status={params.status}

          onEventKeyChange={setEventKeyInput}

          onStatusChange={(status) => {

            resetPage();

            setParams({ status });

          }}

        />

      </FilterPanel>



      {!useMockData && eventsQuery.isLoading ? (

        <TableSkeleton columns={4} />

      ) : !useMockData && eventsQuery.isError ? (

        <QueryErrorPanel

          error={eventsQuery.error}

          onRetry={() => void eventsQuery.refetch()}

        />

      ) : listData && listData.items.length > 0 ? (

        <>

          <TablePanel>

            <EventsTable items={listData.items} />

          </TablePanel>

          <TablePagination

            page={listData.meta.page}

            totalPages={listData.meta.totalPages}

            total={listData.meta.total}

            onPageChange={(page) => setParams({ page })}

          />

        </>

      ) : (

        <EmptyState

          title="No events yet"

          description="Events ingested via the API will appear here with their processing status."

        />

      )}

    </ListPageShell>

  );

}


