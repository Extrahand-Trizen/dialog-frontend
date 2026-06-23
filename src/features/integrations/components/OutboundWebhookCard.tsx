import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { getOutboundWebhook } from '@/features/integrations/api/getOutboundWebhook';
import { upsertOutboundWebhook } from '@/features/integrations/api/upsertOutboundWebhook';
import { WEBHOOK_EVENTS, WEBHOOK_PAYLOAD_EXAMPLE } from '@/features/integrations/constants';
import { integrationKeys } from '@/features/integrations/queryKeys';
import { canManageApiKeys } from '@/lib/permissions';

function generateWebhookSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function OutboundWebhookCard() {
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const canManage = canManageApiKeys(user);
  const queryClient = useQueryClient();

  const configQuery = useQuery({
    queryKey: integrationKeys.outboundWebhook(),
    queryFn: getOutboundWebhook,
    enabled: !useMockData,
  });

  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (configQuery.data) {
      setUrl(configQuery.data.url);
      setEnabled(configQuery.data.enabled);
      setSecret('');
    }
  }, [configQuery.data]);

  const saveMutation = useMutation({
    mutationFn: upsertOutboundWebhook,
    onSuccess: (data) => {
      queryClient.setQueryData(integrationKeys.outboundWebhook(), data);
      setSecret('');
      setSavedMessage('Webhook configuration saved.');
    },
  });

  const handleGenerateSecret = useCallback(() => {
    setSecret(generateWebhookSecret());
  }, []);

  const handleSave = useCallback(() => {
    setSavedMessage(null);
    const payload = {
      url: url.trim(),
      enabled,
      ...(secret.trim() ? { secret: secret.trim() } : {}),
    };
    saveMutation.mutate(payload);
  }, [enabled, saveMutation, secret, url]);

  const needsSecret = !useMockData && configQuery.data && !configQuery.data.hasSecret && !secret.trim();

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Outbound webhooks</CardTitle>
        <CardDescription>
          The platform POSTs delivery events to your backend (MyOperator WebHooks New shape).
          Verify requests with the HMAC signature header.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {configQuery.isError ? <QueryErrorPanel error={configQuery.error} onRetry={() => configQuery.refetch()} /> : null}

        {useMockData ? (
          <p className="text-sm text-muted-foreground">
            Disable mock auth to configure live webhook subscriptions.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://api.extrahand.com/webhooks/whatsapp-ops"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={!canManage || saveMutation.isPending}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="webhook-secret">Signing secret</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-secret"
                  type="password"
                  placeholder={configQuery.data?.hasSecret ? 'Leave blank to keep existing secret' : 'Min 16 characters'}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  disabled={!canManage || saveMutation.isPending}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSecret}
                  disabled={!canManage || saveMutation.isPending}
                >
                  Generate
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="webhook-enabled"
                checked={enabled}
                onCheckedChange={setEnabled}
                disabled={!canManage || saveMutation.isPending}
              />
              <Label htmlFor="webhook-enabled">Enabled</Label>
            </div>
            <div className="flex items-center justify-end gap-2">
              {savedMessage ? (
                <span className="text-sm text-muted-foreground">{savedMessage}</span>
              ) : null}
              <Button
                onClick={handleSave}
                disabled={!canManage || saveMutation.isPending || !url.trim() || needsSecret}
              >
                {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </Button>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium">Events</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {WEBHOOK_EVENTS.map((row) => (
              <li key={row.event}>
                <code className="text-foreground">{row.event}</code> — {row.when}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium">Payload example</p>
          <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {WEBHOOK_PAYLOAD_EXAMPLE}
          </pre>
          <p className="mt-2 text-sm text-muted-foreground">
            Verify the webhook HMAC signature header on each POST (
            <code className="text-foreground">sha256=…</code>).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
