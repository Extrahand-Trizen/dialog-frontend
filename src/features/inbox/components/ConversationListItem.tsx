import { formatDistanceToNowStrict } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContactAvatar } from '@/features/inbox/components/ContactAvatar';
import type { ConversationSummaryDto } from '@/features/inbox/types';

type ConversationListItemProps = {
  conversation: ConversationSummaryDto;
  isActive: boolean;
  onSelect: () => void;
};

export function ConversationListItem({ conversation, isActive, onSelect }: ConversationListItemProps) {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 border-b px-3 py-3 text-left transition-colors hover:bg-muted/50',
        isActive && 'bg-muted',
      )}
    >
      <ContactAvatar phone={conversation.contactPhone} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={cn('truncate text-sm', hasUnread ? 'font-semibold' : 'font-medium')}>
            +{conversation.contactPhone}
          </span>
          <span className={cn('shrink-0 text-xs', hasUnread ? 'font-medium text-primary' : 'text-muted-foreground')}>
            {formatDistanceToNowStrict(new Date(conversation.lastMessageAt), { addSuffix: false })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1 truncate text-xs text-muted-foreground">
            {conversation.lastMessageDirection === 'OUTBOUND' ? (
              <ArrowUpRight className="size-3 shrink-0" />
            ) : conversation.lastMessageDirection === 'INBOUND' ? (
              <ArrowDownLeft className="size-3 shrink-0" />
            ) : null}
            <span className={cn('truncate', hasUnread && 'text-foreground')}>
              {conversation.lastMessagePreview ?? 'No messages yet'}
            </span>
          </span>
          {hasUnread ? (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
