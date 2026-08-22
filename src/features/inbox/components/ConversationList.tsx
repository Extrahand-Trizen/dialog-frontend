import { Search } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TablePagination } from '@/components/shared/TablePagination';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversations } from '@/features/inbox/hooks/useConversations';
import { ConversationListItem } from '@/features/inbox/components/ConversationListItem';

type ConversationListProps = {
  page: number;
  search: string;
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  selectedId: string | undefined;
  onSelect: (conversationId: string) => void;
};

const CONVERSATIONS_PAGE_SIZE = 30;

export function ConversationList({
  page,
  search,
  onPageChange,
  onSearchChange,
  selectedId,
  onSelect,
}: ConversationListProps) {
  const query = useConversations({ page, limit: CONVERSATIONS_PAGE_SIZE, search: search || undefined });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search number…"
            className="h-9 pl-8"
          />
        </div>
      </div>

      {query.isLoading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : query.isError ? (
        <div className="p-4">
          <QueryErrorPanel error={query.error} onRetry={() => void query.refetch()} />
        </div>
      ) : (query.data?.items.length ?? 0) === 0 ? (
        <div className="p-4">
          <EmptyState
            title="No conversations yet"
            description="Messages you send from Inbox or Messages, and customer replies, show up here."
          />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            {query.data?.items.map((conversation) => (
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
        </>
      )}
    </div>
  );
}
