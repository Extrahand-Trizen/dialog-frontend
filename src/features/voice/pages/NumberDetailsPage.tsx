import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/shared/EmptyState';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { getVirtualNumber, updateVirtualNumber } from '../api/voiceApi';
import { voiceKeys } from '../queryKeys';
import { BlurredNumber, ComingSoonButton, ComingSoonNotice } from '../ComingSoon';
import { isFeatureEnabled } from '@/config/features';
import { useState, useEffect } from 'react';

export function NumberDetailsPage() {
  const callingLive = isFeatureEnabled('callingLive');
  const { numberId = '' } = useParams();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: voiceKeys.number(numberId),
    queryFn: () => getVirtualNumber(numberId),
    enabled: Boolean(numberId),
  });
  const mutation = useMutation({
    mutationFn: (
      body: Parameters<typeof updateVirtualNumber>[1],
    ) => updateVirtualNumber(numberId, body),
    onSuccess: (data) => {
      queryClient.setQueryData(voiceKeys.number(numberId), data);
      void queryClient.invalidateQueries({ queryKey: voiceKeys.numbers() });
    },
  });

  const number = query.data;
  const [destination, setDestination] = useState('');
  const [application, setApplication] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    if (!number) return;
    setDestination(number.destinationE164 ?? '');
    setApplication(number.assignedApplication ?? '');
    setWebhookUrl(number.webhookUrl ?? '');
  }, [number]);

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError) {
    return <QueryErrorPanel error={query.error} onRetry={() => void query.refetch()} />;
  }
  if (!number) {
    return (
      <EmptyState
        title="Number not found"
        description="This virtual number is not on your account."
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <ComingSoonNotice description="This number is shown as a preview. Live calling and routing changes are coming soon." />
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/virtual-numbers">
          <ArrowLeft className="size-4" />
          My numbers
        </Link>
      </Button>

      <Card className="border-border/70 shadow-none">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-lg font-semibold">
                <BlurredNumber value={number.displayNumber} />
              </p>
              <p className="text-sm text-muted-foreground">
                {number.countryName} · {number.locality}
              </p>
            </div>
            <Badge variant={number.status === 'active' ? 'secondary' : 'outline'}>
              {number.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Inbound calls" value={String(number.inboundCount)} />
            <Stat label="Outbound calls" value={String(number.outboundCount)} />
            <Stat label="Total minutes" value={`${number.minutesUsed}`} />
          </div>
          <p className="text-xs text-muted-foreground">
            Incoming {number.incomingEnabled ? 'enabled' : 'off'} · Outgoing{' '}
            {number.outgoingEnabled ? 'enabled' : 'off'} · Number masking{' '}
            {number.maskingEnabled !== false ? 'enabled' : 'off'}
          </p>
          <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
            <p className="text-sm">Number active</p>
            <Switch
              checked={number.status === 'active'}
              disabled={!callingLive || mutation.isPending}
              onCheckedChange={(checked) =>
                mutation.mutate({ status: checked ? 'ACTIVE' : 'INACTIVE' })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-semibold">Call routing</p>
          <p className="text-xs text-muted-foreground">
            Incoming calls can be routed to a destination you configure. Outgoing calls use this Trizen
            virtual number as caller ID. Your personal phone number stays private.
          </p>
          <label className="block space-y-1.5">
            <span className="text-xs text-muted-foreground">Assigned application</span>
            <Input
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              placeholder="Website, iOS app…"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs text-muted-foreground">Incoming call routing (E.164)</span>
            <Input
              className={!callingLive ? 'select-none blur-[5px]' : undefined}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="9198XXXXXXXX"
              disabled={!callingLive}
            />
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={number.incomingEnabled}
                disabled={!callingLive || mutation.isPending}
                onCheckedChange={(checked) => mutation.mutate({ incomingEnabled: checked })}
              />
              Incoming
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={number.outgoingEnabled}
                disabled={!callingLive || mutation.isPending}
                onCheckedChange={(checked) => mutation.mutate({ outgoingEnabled: checked })}
              />
              Outgoing
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={number.maskingEnabled !== false}
                disabled={!callingLive || mutation.isPending}
                onCheckedChange={(checked) => mutation.mutate({ maskingEnabled: checked })}
              />
              Number masking
            </label>
          </div>
          {callingLive ? (
            <Button
              type="button"
              disabled={mutation.isPending}
              onClick={() =>
                mutation.mutate({
                  assignedApplication: application || null,
                  destinationE164: destination || null,
                })
              }
            >
              Save changes
            </Button>
          ) : (
            <ComingSoonButton size="default" />
          )}
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-semibold">Call events webhook</p>
          <p className="text-xs text-muted-foreground">
            Trizen POSTs normalized call events to this URL. Provider payloads are never forwarded.
          </p>
          <Input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-app.com/webhooks/trizen-voice"
          />
          {callingLive ? (
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate({ webhookUrl: webhookUrl || null })}
            >
              Save webhook
            </Button>
          ) : (
            <ComingSoonButton variant="outline" />
          )}
        </CardContent>
      </Card>

      <Button asChild variant="outline">
        <Link to="/calls">View call history</Link>
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
