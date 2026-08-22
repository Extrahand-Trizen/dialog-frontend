import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, MessageCircle, Phone, PhoneMissed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { formatDateTime } from '@/lib/format';
import { listCallContacts, listCallNotifications } from '../api/callsApi';
import { callKeys } from '../queryKeys';
import { useCalling } from '../CallingProvider';
import { ComingSoonButton, ComingSoonNotice } from '@/features/voice/ComingSoon';
import { isFeatureEnabled } from '@/config/features';
import type { CallingNotification } from '../types';

function NotificationIcon({ type }: { type: CallingNotification['type'] }) {
  if (type === 'missed_call') {
    return (
      <div className="flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <PhoneMissed className="size-4" />
      </div>
    );
  }
  if (type === 'completed_call') {
    return (
      <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
        <Phone className="size-4" />
      </div>
    );
  }
  return (
    <div className="flex size-9 items-center justify-center rounded-full bg-sky-500/10 text-sky-700">
      <MessageCircle className="size-4" />
    </div>
  );
}

export function CallNotificationsPage() {
  const { openConfirm } = useCalling();
  const callingLive = isFeatureEnabled('callingLive');
  const notificationsQuery = useQuery({
    queryKey: callKeys.notifications(),
    queryFn: listCallNotifications,
  });
  const contactsQuery = useQuery({
    queryKey: callKeys.contacts(),
    queryFn: listCallContacts,
  });

  if (notificationsQuery.isLoading) return <TableSkeleton />;
  if (notificationsQuery.isError) {
    return (
      <QueryErrorPanel
        error={notificationsQuery.error}
        onRetry={() => void notificationsQuery.refetch()}
      />
    );
  }

  const items = notificationsQuery.data ?? [];
  const contacts = contactsQuery.data ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <ComingSoonNotice description="Call-back from notifications is coming soon. WhatsApp chat stays available." />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Bell className="size-4" />
        Missed calls, completed calls, and WhatsApp activity.
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/70 px-4 py-10 text-center text-sm text-muted-foreground">
          No calling notifications yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const contact = contacts.find((c) => c.id === item.contactId);
            return (
              <Card
                key={item.id}
                className={`border-border/70 shadow-none ${item.read ? '' : 'ring-1 ring-primary/20'}`}
              >
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <NotificationIcon type={item.type} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-sm text-foreground">{contact?.name ?? 'Contact'}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.body}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(item.at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 self-end sm:self-center">
                    {item.type === 'whatsapp_message' ? (
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/calls/conversations/${item.contactId}`}>Open chat</Link>
                      </Button>
                    ) : callingLive ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => contact && void openConfirm(contact)}
                      >
                        Call
                      </Button>
                    ) : (
                      <ComingSoonButton>Call · Coming soon</ComingSoonButton>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
