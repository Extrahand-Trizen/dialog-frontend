import { useNavigate } from 'react-router-dom';
import { PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCallDuration, formatLiveTimer } from '../formatCalls';
import { useCalling } from '../CallingProvider';
import { callStatusLabel } from './CallStatusIcon';

function CallAvatar({
  initials,
  color,
  pulse,
}: {
  initials: string;
  color: string;
  pulse?: boolean;
}) {
  return (
    <div className="relative">
      {pulse ? (
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
      ) : null}
      <div
        className={cn(
          'relative flex size-24 items-center justify-center rounded-full text-2xl font-semibold text-white shadow-lg sm:size-28',
          color,
        )}
      >
        {initials}
      </div>
    </div>
  );
}

function CallShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-10 shadow-xl">
        {children}
      </div>
    </div>
  );
}

function OutgoingCallScreen() {
  const { session, endCall } = useCalling();
  if (!session) return null;

  return (
    <CallShell>
      <CallAvatar
        initials={session.contact.avatarInitials}
        color={session.contact.avatarColor}
        pulse
      />
      <h2 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight">
        {session.contact.name}
      </h2>
      <p className="mt-4 text-sm font-medium text-primary">
        {session.phase === 'outgoing' ? 'Calling…' : 'Ringing…'}
      </p>
      <div className="mt-4 w-full space-y-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm">
        <p className="text-xs text-muted-foreground">Calling from</p>
        <p className="font-mono text-sm">Trizen number · {session.virtualNumber}</p>
        <p className="pt-1 text-xs text-muted-foreground">Calling</p>
        <p className="font-mono text-sm">{session.contact.maskedPhone}</p>
      </div>
      <p className="mt-3 text-xs font-medium text-emerald-800">Number masking active</p>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        Your personal phone number stays private.
      </p>
      <Button
        type="button"
        variant="destructive"
        size="lg"
        className="mt-10 rounded-full px-8"
        onClick={() => void endCall('CANCELLED')}
      >
        <PhoneOff className="size-4" />
        End Call
      </Button>
    </CallShell>
  );
}

function ActiveCallScreen() {
  const { session, endCall } = useCalling();
  if (!session) return null;

  return (
    <CallShell>
      <CallAvatar
        initials={session.contact.avatarInitials}
        color={session.contact.avatarColor}
      />
      <h2 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight">
        {session.contact.name}
      </h2>
      <p className="mt-2 text-sm font-medium text-primary">Connected</p>
      <p className="mt-1 font-mono text-lg tabular-nums text-muted-foreground">
        {formatLiveTimer(session.elapsedSeconds)}
      </p>
      <div className="mt-4 w-full space-y-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm">
        <p className="text-xs text-muted-foreground">Calling from</p>
        <p className="font-mono text-sm">Trizen number · {session.virtualNumber}</p>
        <p className="pt-1 text-xs text-muted-foreground">Calling</p>
        <p className="font-mono text-sm">{session.contact.maskedPhone}</p>
      </div>
      <p className="mt-3 text-xs font-medium text-emerald-800">Number masking active</p>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="mt-10 size-14 rounded-full"
        onClick={() => void endCall('COMPLETED')}
        aria-label="End call"
      >
        <PhoneOff className="size-5" />
      </Button>
    </CallShell>
  );
}

function CallEndedScreen() {
  const navigate = useNavigate();
  const { session, callAgain, closeSession, errorMessage } = useCalling();
  if (!session) return null;
  const status = session.endedStatus ?? 'completed';

  return (
    <CallShell>
      <CallAvatar
        initials={session.contact.avatarInitials}
        color={session.contact.avatarColor}
      />
      <h2 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight">
        {session.contact.name}
      </h2>
      <p className="mt-2 text-sm font-medium text-foreground">Call ended</p>
      <p className="mt-1 text-sm text-muted-foreground">{callStatusLabel(session.direction, status)}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Duration {formatCallDuration(status === 'completed' ? session.elapsedSeconds : null)}
      </p>
      {errorMessage ? <p className="mt-2 text-sm text-destructive">{errorMessage}</p> : null}

      <div className="mt-8 flex w-full flex-col gap-2">
        <Button type="button" onClick={() => void callAgain()}>
          Call Again
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const contactId = session.contact.id;
            closeSession();
            navigate(`/calls/conversations/${contactId}`);
          }}
        >
          Send Message
        </Button>
        <Button type="button" variant="ghost" onClick={closeSession}>
          Close
        </Button>
      </div>
    </CallShell>
  );
}

export function CallSessionOverlay() {
  const { session } = useCalling();
  if (!session) return null;
  if (session.phase === 'outgoing') return <OutgoingCallScreen />;
  if (session.phase === 'active') return <ActiveCallScreen />;
  if (session.phase === 'ended') return <CallEndedScreen />;
  return null;
}
