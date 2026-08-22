import { Link } from 'react-router-dom';
import { Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  CALL_HISTORY_FILTERS,
  type CallHistoryFilter,
  type CallRecord,
} from '../types';
import { formatCallDuration } from '../formatCalls';
import { callDirectionLabel, callStatusLabel } from './CallStatusIcon';
import { useCalling } from '../CallingProvider';
import { ComingSoonButton } from '@/features/voice/ComingSoon';
import { isFeatureEnabled } from '@/config/features';

const FILTER_LABELS: Record<CallHistoryFilter, string> = {
  all: 'All',
  incoming: 'Incoming',
  outgoing: 'Outgoing',
  missed: 'Missed',
};

export function CallsFilters({
  filter,
  search,
  onFilterChange,
  onSearchChange,
}: {
  filter: CallHistoryFilter;
  search: string;
  onFilterChange: (filter: CallHistoryFilter) => void;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {CALL_HISTORY_FILTERS.map((key) => (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={filter === key ? 'default' : 'outline'}
            className="h-8"
            onClick={() => onFilterChange(key)}
          >
            {FILTER_LABELS[key]}
          </Button>
        ))}
      </div>
      <div className="relative w-full lg:max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search contacts…"
          className="h-9 pl-9"
        />
      </div>
    </div>
  );
}

export function CallsHistoryList({
  calls,
  callingLive = isFeatureEnabled('callingLive'),
}: {
  calls: CallRecord[];
  callingLive?: boolean;
}) {
  const { openConfirm } = useCalling();

  if (calls.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 px-4 py-12 text-center text-sm text-muted-foreground">
        No calls yet. Voice calling from contacts is coming soon.
      </div>
    );
  }

  return (
    <ul className="min-w-0 divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-card">
      {calls.map((call) => {
        const contact = call.contact;
        if (!contact) return null;
        return (
          <li
            key={call.id}
            className="flex min-w-0 flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white',
                  contact.avatarColor,
                )}
              >
                {contact.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/calls/contacts/${contact.id}`}
                    className="truncate font-medium text-foreground hover:underline"
                  >
                    {contact.maskedPhone || contact.name}
                  </Link>
                  {call.status === 'missed' ? (
                    <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                      Missed
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {callDirectionLabel(call.direction)} · {callStatusLabel(call.direction, call.status)}
                  {call.durationSeconds ? ` · ${formatCallDuration(call.durationSeconds)}` : ''}
                </p>
                <p className="mt-0.5 max-w-full overflow-hidden text-xs text-muted-foreground">
                  Via{' '}
                  <span className="inline-block max-w-[10rem] truncate align-bottom select-none font-mono blur-[5px]">
                    {call.virtualNumber}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDateTime(call.startedAt)}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-2 self-end sm:self-center">
              <Button asChild variant="ghost" size="sm">
                <Link to={`/calls/conversations/${contact.id}`}>Chat</Link>
              </Button>
              {callingLive ? (
                <Button type="button" size="sm" onClick={() => openConfirm(contact)}>
                  <Phone className="size-3.5" />
                  Call
                </Button>
              ) : (
                <ComingSoonButton>Coming soon</ComingSoonButton>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
