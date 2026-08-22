import { EmptyState } from '@/components/shared/EmptyState';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TablePagination } from '@/components/shared/TablePagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversations } from '@/features/inbox/hooks/useConversations';
import { ConversationListItem } from '@/features/inbox/components/ConversationListItem';

type ConversationListProps = {
  page: number;
  onPageChange: (page: number) => void;
  selectedId: string | undefined;
  onSelect: (conversationId: string) => void;
};

const CONVERSATIONS_PAGE_SIZE = 30;

export function ConversationList({ page, onPageChange, selectedId, onSelect }: ConversationListProps) {
  const query = useConversations({ page, limit: CONVERSATIONS_PAGE_SIZE });

  if (query.isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="p-4">
        <QueryErrorPanel error={query.error} onRetry={() => void query.refetch()} />
      </div>
    );
  }

  const items = query.data?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No conversations yet"
          description="Replies from customers will show up here once they respond to a WhatsApp message."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {items.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === selectedId}
            onSelect={() => onSelect(conversation.id)}
          />
        ))}
      </div>
      {query.data && query.data.meta.totalPages > 1 ? (
        <div className="border-t p-2">
          <TablePagination
            page={query.data.meta.page}
            totalPages={query.data.meta.totalPages}
            total={query.data.meta.total}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </div>
  );
}
