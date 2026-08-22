import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shield, PhoneCall } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { getCallingSettings, updateCallingSettings } from '../api/callsApi';
import { callKeys } from '../queryKeys';
import type { CallingSettings } from '../types';
import { BlurredNumber, ComingSoonButton, ComingSoonNotice } from '@/features/voice/ComingSoon';

const STATUS_LABEL = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  degraded: 'Degraded',
} as const;

export function CallingSettingsPage() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: callKeys.settings(),
    queryFn: getCallingSettings,
  });
  const mutation = useMutation({
    mutationFn: (body: Partial<CallingSettings>) => updateCallingSettings(body),
    onSuccess: (data) => {
      queryClient.setQueryData(callKeys.settings(), data);
    },
  });

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError) {
    return <QueryErrorPanel error={query.error} onRetry={() => void query.refetch()} />;
  }
  const settings = query.data;
  if (!settings) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <ComingSoonNotice description="Calling settings will apply when Trizen Voice is live. Contact calling and virtual numbers are coming soon." />
      <Card className="border-border/70 shadow-none">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PhoneCall className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Trizen Voice</p>
                <p className="text-sm text-muted-foreground">
                  {settings.providerStatus === 'connected'
                    ? 'Preview — live calls through your Trizen virtual number are coming soon'
                    : 'Get a virtual number is coming soon. You can still review this page.'}
                </p>
              </div>
            </div>
            <Badge variant="secondary">{STATUS_LABEL[settings.providerStatus]}</Badge>
          </div>
          <div className="grid gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Virtual / masked number</p>
              <p className="mt-0.5 font-mono text-sm font-medium">
                <BlurredNumber value={settings.virtualNumber} />
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Caller ID display</p>
              <p className="mt-0.5 text-sm font-medium">{settings.callerIdDisplay}</p>
            </div>
          </div>
          {settings.providerStatus !== 'connected' ? (
            <p className="text-xs text-muted-foreground">
              Get a Trizen virtual number to place and receive calls from Dialog and from your website
              via the Voice API.{' '}
              <ComingSoonButton className="mt-2" variant="outline">
                Get a number · Coming soon
              </ComingSoonButton>
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardContent className="divide-y divide-border/60 p-0">
          <div className="px-5 py-4">
            <p className="text-sm font-semibold">Calling preferences</p>
          </div>
          <PreferenceRow
            title="Announce masked calling"
            description="Play a short privacy notice at the start of the call."
            checked={settings.announceMaskedCalling}
            disabled={mutation.isPending}
            onCheckedChange={(checked) =>
              mutation.mutate({ announceMaskedCalling: checked })
            }
          />
          <PreferenceRow
            title="Business hours only"
            description="Block outbound calls outside business hours."
            checked={settings.businessHoursOnly}
            disabled={mutation.isPending}
            onCheckedChange={(checked) => mutation.mutate({ businessHoursOnly: checked })}
          />
          <PreferenceRow
            title="Record calls"
            description="Ask Trizen Voice to retain recordings when available."
            checked={settings.recordCalls}
            disabled={mutation.isPending}
            onCheckedChange={(checked) => mutation.mutate({ recordCalls: checked })}
          />
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardContent className="flex gap-3 p-5">
          <Shield className="mt-0.5 size-4 shrink-0 text-emerald-700" />
          <div>
            <p className="text-sm font-semibold">Privacy</p>
            <p className="mt-1 text-sm text-muted-foreground">{settings.privacyNote}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  );
}
