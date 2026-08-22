import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { ChatThread } from '@/features/inbox/components/ChatThread';
import { ConversationList } from '@/features/inbox/components/ConversationList';
import { ReplyComposer } from '@/features/inbox/components/ReplyComposer';
import { ThreadHeader } from '@/features/inbox/components/ThreadHeader';
import { useConversationThread } from '@/features/inbox/hooks/useConversationThread';
import { useConversations } from '@/features/inbox/hooks/useConversations';
import { useMarkConversationRead } from '@/features/inbox/hooks/useMarkConversationRead';
import { canSendMessages } from '@/lib/permissions';
import { cn } from '@/lib/utils';

export function InboxPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canSend = canSendMessages(user);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const markRead = useMarkConversationRead();

  const listQuery = useConversations({
    page,
    limit: 30,
    search: search || undefined,
  });
  const threadQuery = useConversationThread(conversationId, { page: 1, limit: 50 });
  const inboundUnlocksFreeText = (threadQuery.data?.items ?? []).some((message) => {
    if (message.direction !== 'INBOUND') return false;
    return Date.now() - new Date(message.createdAt).getTime() < 24 * 60 * 60 * 1000;
  });
  const selectedConversation =
    threadQuery.data?.conversation ??
    listQuery.data?.items.find((item) => item.id === conversationId);
  const canSendFreeText =
    inboundUnlocksFreeText || selectedConversation?.canSendFreeText === true;

  useEffect(() => {
    if (conversationId) {
      markRead.mutate(conversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[480px] overflow-hidden rounded-xl border border-border/70 bg-card">
      <div
        className={cn(
          'w-full shrink-0 border-r border-border/60 md:max-w-xs',
          conversationId ? 'hidden md:flex md:flex-col' : 'flex flex-col',
        )}
      >
        <ConversationList
          page={page}
          search={search}
          onPageChange={setPage}
          onSearchChange={setSearch}
          selectedId={conversationId}
          onSelect={(id) => navigate(`/inbox/${id}`)}
        />
      </div>

      <div className={cn('min-w-0 flex-1 flex-col', conversationId ? 'flex' : 'hidden md:flex')}>
        {conversationId ? (
          <>
            {selectedConversation ? (
              <ThreadHeader
                contactPhone={selectedConversation.contactPhone}
                canSendFreeText={canSendFreeText}
                freeTextWindowExpiresAt={selectedConversation.freeTextWindowExpiresAt}
                onBack={() => navigate('/inbox')}
              />
            ) : null}
            <ChatThread conversationId={conversationId} />
            {canSend ? (
              <ReplyComposer
                conversationId={conversationId}
                canSendFreeText={canSendFreeText}
              />
            ) : null}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8">
            <EmptyState
              title="Select a conversation"
              description="Choose a contact from the list to view the thread and reply."
            />
          </div>
        )}
      </div>
    </div>
  );
}
