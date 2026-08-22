import { PhoneIncoming, PhoneMissed, PhoneOutgoing } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CallDirection, CallStatus } from '../types';

export function CallStatusIcon({
  direction,
  status,
  className,
}: {
  direction: CallDirection;
  status: CallStatus;
  className?: string;
}) {
  if (
    status === 'missed' ||
    status === 'failed' ||
    status === 'busy' ||
    status === 'no_answer' ||
    status === 'cancelled'
  ) {
    return (
      <PhoneMissed
        className={cn('size-4 text-destructive', className)}
        aria-label="Missed call"
      />
    );
  }
  if (direction === 'incoming') {
    return (
      <PhoneIncoming
        className={cn('size-4 text-emerald-600', className)}
        aria-label="Incoming call"
      />
    );
  }
  return (
    <PhoneOutgoing
      className={cn('size-4 text-sky-600', className)}
      aria-label="Outgoing call"
    />
  );
}

const STATUS_COPY: Record<CallStatus, string> = {
  queued: 'Queued',
  ringing: 'Ringing',
  answered: 'Answered',
  completed: 'Completed',
  missed: 'Missed',
  busy: 'Busy',
  no_answer: 'No answer',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export function callStatusLabel(_direction: CallDirection, status: CallStatus): string {
  return STATUS_COPY[status] ?? status;
}

export function callDirectionLabel(direction: CallDirection): string {
  return direction === 'incoming' ? 'Incoming' : 'Outgoing';
}
