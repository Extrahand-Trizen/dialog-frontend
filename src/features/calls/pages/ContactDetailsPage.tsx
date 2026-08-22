import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { formatDateTime } from '@/lib/format';
import { formatCallDuration } from '../formatCalls';
import { getCallContact, listCalls } from '../api/callsApi';
import { callKeys } from '../queryKeys';
import { useCalling } from '../CallingProvider';
import { CallStatusIcon, callStatusLabel } from '../components/CallStatusIcon';
import { ComingSoonButton, ComingSoonNotice } from '@/features/voice/ComingSoon';
import { isFeatureEnabled } from '@/config/features';

export function ContactDetailsPage() {
  const { contactId = '' } = useParams();
  const { openConfirm } = useCalling();
  const callingLive = isFeatureEnabled('callingLive');
  const contactQuery = useQuery({
    queryKey: callKeys.contact(contactId),
    queryFn: () => getCallContact(contactId),
    enabled: Boolean(contactId),
  });
  const callsQuery = useQuery({
    queryKey: callKeys.list({ contactId }),
    queryFn: () => listCalls({ page: 1, limit: 20, contactId }),
    enabled: Boolean(contactId),
  });

  if (contactQuery.isLoading) return <TableSkeleton />;
  if (contactQuery.isError) {
    return (
      <QueryErrorPanel error={contactQuery.error} onRetry={() => void contactQuery.refetch()} />
    );
  }
  const contact = contactQuery.data;
  if (!contact) {
    return (
      <EmptyState
        title="Contact not found"
        description="This contact is not in the calling directory yet."
      />
    );
  }

  const calls = callsQuery.data?.items ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <ComingSoonNotice description="Calling this contact from Dialog is coming soon. WhatsApp chat stays available." />
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/calls">
          <ArrowLeft className="size-4" />
          Back to calls
        </Link>
      </Button>

      <Card className="overflow-hidden border-border/70 shadow-none">
        <div className="border-b border-border/60 bg-gradient-to-br from-primary/[0.07] via-background to-background px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              className={`flex size-16 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white ${contact.avatarColor}`}
            >
              {contact.avatarInitials}
            </div>
            <div className="min-w-0 space-y-1">
              <h2 className="font-display text-xl font-semibold tracking-tight">{contact.name}</h2>
              <p className="text-sm text-muted-foreground">{contact.maskedPhone}</p>
              {contact.company ? (
                <p className="text-xs text-muted-foreground">{contact.company}</p>
              ) : null}
            </div>
          </div>
        </div>
        <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:p-5">
          {callingLive ? (
            <Button type="button" className="flex-1" onClick={() => void openConfirm(contact)}>
              <Phone className="size-4" />
              Call
            </Button>
          ) : (
            <ComingSoonButton className="flex-1" size="default">
              Call · Coming soon
            </ComingSoonButton>
          )}
          <Button asChild variant="outline" className="flex-1" disabled={!contact.whatsappAvailable}>
            <Link to={`/calls/conversations/${contact.id}`}>
              <MessageCircle className="size-4" />
              WhatsApp
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardContent className="p-0">
          <div className="border-b border-border/60 px-5 py-3">
            <h3 className="text-sm font-semibold">Recent call activity</h3>
          </div>
          {calls.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">No calls yet.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {calls.map((call) => (
                <li key={call.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <CallStatusIcon direction={call.direction} status={call.status} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {callStatusLabel(call.direction, call.status)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(call.startedAt)} · {formatCallDuration(call.durationSeconds)}
                      </p>
                    </div>
                  </div>
                  {callingLive ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void openConfirm(contact)}
                    >
                      Call again
                    </Button>
                  ) : (
                    <ComingSoonButton variant="outline">Call again · Coming soon</ComingSoonButton>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
