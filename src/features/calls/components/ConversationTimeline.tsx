import { formatDateTime } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { formatCallDuration } from '../formatCalls';
import type { ConversationTimelineItem } from '../types';
import { CallStatusIcon, callStatusLabel } from './CallStatusIcon';
import { useCalling } from '../CallingProvider';
import { ComingSoonButton } from '@/features/voice/ComingSoon';
import { isFeatureEnabled } from '@/config/features';

export function CallTimelineItem({
  item,
  contactId,
}: {
  item: Extract<ConversationTimelineItem, { kind: 'call' }>;
  contactId: string;
}) {
  const { openConfirm } = useCalling();
  const callingLive = isFeatureEnabled('callingLive');
  const showCallAgain = item.status === 'missed' || item.status === 'completed';

  return (
    <div className="flex gap-3 rounded-xl border border-border/50 bg-muted/30 px-3 py-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-background">
        <CallStatusIcon direction={item.direction} status={item.status} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {callStatusLabel(item.direction, item.status)}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDateTime(item.at)}
          {item.durationSeconds != null ? ` · ${formatCallDuration(item.durationSeconds)}` : ''}
        </p>
        {showCallAgain ? (
          callingLive ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 h-8"
              onClick={() => openConfirm(contactId)}
            >
              <Phone className="size-3.5" />
              Call again
            </Button>
          ) : (
            <ComingSoonButton variant="outline" className="mt-2">
              Call again · Coming soon
            </ComingSoonButton>
          )
        ) : null}
      </div>
    </div>
  );
}

export function MessageTimelineItem({
  item,
}: {
  item: Extract<ConversationTimelineItem, { kind: 'message' }>;
}) {
  const outbound = item.direction === 'outbound';
  return (
    <div className={`flex ${outbound ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
          outbound
            ? 'bg-primary text-primary-foreground'
            : 'border border-border/60 bg-card text-foreground'
        }`}
      >
        <p>{item.body}</p>
        <p
          className={`mt-1 text-[11px] ${outbound ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}
        >
          {formatDateTime(item.at)}
        </p>
      </div>
    </div>
  );
}
