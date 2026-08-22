import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { ChatThread } from '@/features/inbox/components/ChatThread';
import { ConversationList } from '@/features/inbox/components/ConversationList';
import { ReplyComposer } from '@/features/inbox/components/ReplyComposer';
import { ThreadHeader } from '@/features/inbox/components/ThreadHeader';
import { useConversations } from '@/features/inbox/hooks/useConversations';
import { useMarkConversationRead } from '@/features/inbox/hooks/useMarkConversationRead';
import { canSendMessages } from '@/lib/permissions';

export function InboxPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canSend = canSendMessages(user);
  const [page, setPage] = useState(1);
  const markRead = useMarkConversationRead();

  // Reuse the already-fetched list page to find the selected conversation's
  // canSendFreeText hint without a second round trip.
  const listQuery = useConversations({ page, limit: 30 });
  const selectedConversation = listQuery.data?.items.find((item) => item.id === conversationId);

  useEffect(() => {
    if (conversationId) {
      markRead.mutate(conversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border">
      <div className="w-full max-w-xs shrink-0 border-r">
        <ConversationList
          page={page}
          onPageChange={setPage}
          selectedId={conversationId}
          onSelect={(id) => navigate(`/inbox/${id}`)}
        />
      </div>

      <div className="flex flex-1 flex-col">
        {conversationId ? (
          <>
            {selectedConversation ? (
              <ThreadHeader
                contactPhone={selectedConversation.contactPhone}
                canSendFreeText={selectedConversation.canSendFreeText}
                onBack={() => navigate('/inbox')}
              />
            ) : null}
            <ChatThread conversationId={conversationId} />
            {canSend ? (
              <ReplyComposer
                conversationId={conversationId}
                canSendFreeText={selectedConversation?.canSendFreeText ?? false}
              />
            ) : null}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8">
            <EmptyState
              title="Select a conversation"
              description="Choose a contact from the list to view the message thread."
            />
          </div>
        )}
      </div>
    </div>
  );
}
