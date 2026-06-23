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

import {

  filterDevMockMessages,

  getDevMockMessageDetail,

} from '@/config/dev-mock-data';

import { getMessage, listMessages } from '@/features/messages/api/messagesApi';

import { MessageDetailDialog } from '@/features/messages/components/MessageDetailDialog';

import { MessagesFilters } from '@/features/messages/components/MessagesFilters';

import { MessagesTable } from '@/features/messages/components/MessagesTable';

import { messageKeys } from '@/features/messages/queryKeys';

import type { MessageListStatus } from '@/features/messages/types';



const MESSAGE_FILTER_DEFAULTS = {

  status: undefined as MessageListStatus | undefined,

  recipientPhone: undefined as string | undefined,

  metaTemplateName: undefined as string | undefined,

};



export function MessagesPage() {

  const useMockData = isDevMockAuthEnabled();

  const { params, setParams, resetPage } = useTableParams(MESSAGE_FILTER_DEFAULTS);

  const [recipientInput, setRecipientInput] = useState(params.recipientPhone ?? '');

  const [templateInput, setTemplateInput] = useState(params.metaTemplateName ?? '');

  const debouncedRecipient = useDebouncedValue(recipientInput);

  const debouncedTemplate = useDebouncedValue(templateInput);

  const [selectedId, setSelectedId] = useState<string | null>(null);



  useEffect(() => {

    resetPage();

    setParams({

      recipientPhone: debouncedRecipient || undefined,

      metaTemplateName: debouncedTemplate || undefined,

    });

  }, [debouncedRecipient, debouncedTemplate, resetPage, setParams]);



  const queryParams = useMemo(

    () => ({

      page: params.page,

      limit: params.limit,

      status: params.status,

      recipientPhone: params.recipientPhone,

      metaTemplateName: params.metaTemplateName,

    }),

    [params],

  );



  const messagesQuery = useQuery({

    queryKey: messageKeys.list(queryParams),

    queryFn: () => listMessages(queryParams),

    enabled: !useMockData,

    placeholderData: (prev) => prev,

  });



  const detailQuery = useQuery({

    queryKey: messageKeys.detail(selectedId ?? ''),

    queryFn: () => getMessage({ messageId: selectedId! }),

    enabled: !useMockData && !!selectedId,

  });



  const listData = useMockData ? filterDevMockMessages(queryParams) : messagesQuery.data;

  const detailData = useMockData

    ? selectedId

      ? getDevMockMessageDetail(selectedId)

      : undefined

    : detailQuery.data;



  return (

    <ListPageShell>

      <FilterPanel>

        <MessagesFilters

          recipientPhone={recipientInput}

          metaTemplateName={templateInput}

          status={params.status}

          onRecipientPhoneChange={setRecipientInput}

          onMetaTemplateNameChange={setTemplateInput}

          onStatusChange={(status) => {

            resetPage();

            setParams({ status });

          }}

        />

      </FilterPanel>



      {!useMockData && messagesQuery.isLoading ? (

        <TableSkeleton />

      ) : !useMockData && messagesQuery.isError ? (

        <QueryErrorPanel

          error={messagesQuery.error}

          onRetry={() => void messagesQuery.refetch()}

        />

      ) : listData && listData.items.length > 0 ? (

        <>

          <TablePanel>

            <MessagesTable items={listData.items} onSelect={setSelectedId} />

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

          title="No messages yet"

          description="Outbound WhatsApp messages will appear here once notification rules send them."

        />

      )}



      {selectedId ? (

        <MessageDetailDialog

          messageId={selectedId}

          data={detailData}

          isLoading={!useMockData && detailQuery.isLoading}

          isError={!useMockData && detailQuery.isError}

          error={detailQuery.error}

          onClose={() => setSelectedId(null)}

        />

      ) : null}

    </ListPageShell>

  );

}


