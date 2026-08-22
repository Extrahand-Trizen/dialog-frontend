import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { getConversation } from '../api/callsApi';
import { callKeys } from '../queryKeys';
import { useCalling } from '../CallingProvider';
import { CallTimelineItem, MessageTimelineItem } from '../components/ConversationTimeline';
import { ComingSoonButton } from '@/features/voice/ComingSoon';
import { isFeatureEnabled } from '@/config/features';

export function ConversationPage() {
  const { contactId = '' } = useParams();
  const { openConfirm } = useCalling();
  const callingLive = isFeatureEnabled('callingLive');
  const query = useQuery({
    queryKey: callKeys.conversation(contactId),
    queryFn: () => getConversation(contactId),
    enabled: Boolean(contactId),
  });

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError) {
    return <QueryErrorPanel error={query.error} onRetry={() => void query.refetch()} />;
  }
  if (!query.data) {
    return (
      <EmptyState
        title="Conversation not found"
        description="This contact is not in the calling directory yet."
      />
    );
  }

  const { contact, items } = query.data;

  return (
    <div className="flex h-[calc(100vh-10rem)] min-h-[480px] flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link to="/calls" aria-label="Back to calls">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Link to={`/calls/contacts/${contact.id}`} className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${contact.avatarColor}`}
            >
              {contact.avatarInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{contact.name}</p>
              <p className="truncate text-xs text-muted-foreground">{contact.maskedPhone}</p>
            </div>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {callingLive ? (
            <Button type="button" size="sm" onClick={() => void openConfirm(contact)}>
              <Phone className="size-3.5" />
              Call
            </Button>
          ) : (
            <ComingSoonButton>Call · Coming soon</ComingSoonButton>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
        {items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          items.map((item) =>
            item.kind === 'call' ? (
              <CallTimelineItem key={item.id} item={item} contactId={contact.id} />
            ) : (
              <MessageTimelineItem key={item.id} item={item} />
            ),
          )
        )}
      </div>

      <footer className="shrink-0 border-t border-border/60 px-3 py-3 sm:px-4">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <MessageCircle className="size-3.5" />
          WhatsApp messages from this number appear here. Contact calling is coming soon.
        </p>
      </footer>
    </div>
  );
}
