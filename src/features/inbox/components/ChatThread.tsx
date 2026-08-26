import { useEffect, useRef } from 'react';
import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { AlertTriangle, ExternalLink, Phone } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversationThread } from '@/features/inbox/hooks/useConversationThread';
import { MessageStatusTicks } from '@/features/inbox/components/MessageStatusTicks';
import { cn } from '@/lib/utils';
import type { ConversationThreadMessageDto } from '@/features/inbox/types';

const THREAD_PAGE_SIZE = 50;

function messageBodyLabel(message: ConversationThreadMessageDto): string {
  if (message.bodyText) return message.bodyText;
  if (message.type === 'TEMPLATE') return `Template: ${message.metaTemplateName ?? 'unknown'}`;
  switch (message.type) {
    case 'IMAGE':
      return '📷 Photo';
    case 'VIDEO':
      return '🎥 Video';
    case 'DOCUMENT':
      return '📄 Document';
    case 'AUDIO':
      return '🎤 Audio';
    case 'INTERACTIVE':
      return '[Interactive message]';
    default:
      return '[Message]';
  }
}

/** Pulls the header image URL out of a sent template's Meta component payload, if any. */
function extractHeaderImageUrl(components: unknown): string | null {
  if (!Array.isArray(components)) return null;
  for (const raw of components) {
    if (!raw || typeof raw !== 'object') continue;
    const component = raw as { type?: unknown; parameters?: unknown };
    if (String(component.type ?? '').toLowerCase() !== 'header') continue;
    if (!Array.isArray(component.parameters)) continue;
    for (const param of component.parameters) {
      if (!param || typeof param !== 'object') continue;
      const p = param as { type?: unknown; image?: { link?: unknown } };
      if (p.type === 'image' && typeof p.image?.link === 'string') {
        return p.image.link;
      }
    }
  }
  return null;
}

function dayLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
}

function DateDivider({ date }: { date: Date }) {
  return (
    <div className="flex justify-center py-2">
      <span className="rounded-full bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm ring-1 ring-border">
        {dayLabel(date)}
      </span>
    </div>
  );
}

function TemplateButtonRow({
  button,
  isOutbound,
}: {
  button: ConversationThreadMessageDto['buttons'][number];
  isOutbound: boolean;
}) {
  const rowClass = cn(
    'flex w-full items-center justify-center gap-1.5 border-t px-3 py-2 text-[13px] font-medium',
    isOutbound
      ? 'border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10'
      : 'border-border text-primary hover:bg-muted/60',
  );

  if (button.url) {
    return (
      <a href={button.url} target="_blank" rel="noreferrer" className={rowClass}>
        <ExternalLink className="size-3.5" />
        {button.label}
      </a>
    );
  }
  if (button.phoneNumber) {
    return (
      <a href={`tel:${button.phoneNumber}`} className={rowClass}>
        <Phone className="size-3.5" />
        {button.label}
      </a>
    );
  }
  return <div className={cn(rowClass, 'cursor-default opacity-70 hover:bg-transparent')}>{button.label}</div>;
}

function MessageBubble({
  message,
  grouped,
}: {
  message: ConversationThreadMessageDto;
  grouped: boolean;
}) {
  const isOutbound = message.direction === 'OUTBOUND';

  const isFailed = message.status === 'FAILED';
  const headerImageUrl = message.type === 'TEMPLATE' ? extractHeaderImageUrl(message.components) : null;

  return (
    <div className={cn('flex w-full', isOutbound ? 'justify-end' : 'justify-start', grouped ? 'mt-0.5' : 'mt-2.5')}>
      <div
        className={cn(
          'relative max-w-[75%] overflow-hidden rounded-lg shadow-sm',
          isOutbound
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card text-card-foreground rounded-tl-sm ring-1 ring-border',
        )}
      >
        {headerImageUrl ? (
          <img
            src={headerImageUrl}
            alt=""
            className="max-h-64 w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="px-3.5 py-2.5">
        <p className="whitespace-pre-wrap break-words font-chat text-[14.5px] leading-[1.45]">
          {messageBodyLabel(message)}
        </p>
        <div
          className={cn(
            'mt-1 flex items-center justify-end gap-1 text-[11px] font-medium',
            isOutbound ? 'text-primary-foreground/80' : 'text-muted-foreground',
          )}
        >
          <span>{format(new Date(message.createdAt), 'HH:mm')}</span>
          {isOutbound ? (
            <MessageStatusTicks
              status={message.status}
              className={isFailed ? undefined : 'text-primary-foreground/80'}
            />
          ) : null}
        </div>
        {isFailed && message.errorMessage ? (
          <div className="mt-1.5 flex items-start gap-1.5 rounded-md bg-red-950/10 px-2 py-1.5 text-[12px] text-red-100 dark:bg-red-950/40">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-red-200" />
            <span className="leading-snug">{message.errorMessage}</span>
          </div>
        ) : null}
        </div>
        {message.buttons.map((button, index) => (
          <TemplateButtonRow key={`${button.label}-${index}`} button={button} isOutbound={isOutbound} />
        ))}
      </div>
    </div>
  );
}

export function ChatThread({ conversationId }: { conversationId: string }) {
  const query = useConversationThread(conversationId, { page: 1, limit: THREAD_PAGE_SIZE });
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = query.data?.items ?? [];
  const lastMessageId = items[items.length - 1]?.id;

  // Auto-scroll to the newest message — on opening a conversation and whenever a
  // new message arrives (sent or received), same as any chat app.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [conversationId, lastMessageId]);

  if (query.isLoading) {
    return (
      <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={cn('h-12 w-2/3', i % 2 === 0 ? 'ml-auto' : '')} />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex-1 bg-muted/30 p-4">
        <QueryErrorPanel error={query.error} onRetry={() => void query.refetch()} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-4">
        <EmptyState title="No messages yet" description="Nothing has been sent or received in this conversation." />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto bg-muted/30 px-4 py-2">
      {items.map((message, index) => {
        const previous = items[index - 1];
        const createdAt = new Date(message.createdAt);
        const showDateDivider = !previous || !isSameDay(createdAt, new Date(previous.createdAt));
        const grouped =
          !showDateDivider &&
          !!previous &&
          previous.direction === message.direction &&
          createdAt.getTime() - new Date(previous.createdAt).getTime() < 5 * 60 * 1000;

        return (
          <div key={message.id}>
            {showDateDivider ? <DateDivider date={createdAt} /> : null}
            <MessageBubble message={message} grouped={grouped} />
          </div>
        );
      })}
    </div>
  );
}
