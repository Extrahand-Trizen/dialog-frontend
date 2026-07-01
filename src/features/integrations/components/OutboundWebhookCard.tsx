import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { getOutboundWebhook } from '@/features/integrations/api/getOutboundWebhook';
import { upsertOutboundWebhook } from '@/features/integrations/api/upsertOutboundWebhook';
import { CodeSnippet } from '@/features/integrations/components/CodeSnippet';
import { DocSubsection, IntegrationDocCard } from '@/features/integrations/components/IntegrationDocCard';
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
    <IntegrationDocCard
      id="outbound-webhooks"
      title="Outbound webhooks"
      description="The platform POSTs delivery events to your backend (MyOperator WebHooks New shape). Verify requests with the HMAC signature header."
      className="lg:col-span-2"
    >
      {configQuery.isError ? (
        <QueryErrorPanel error={configQuery.error} onRetry={() => configQuery.refetch()} />
      ) : null}

      {useMockData ? (
        <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Disable mock auth to configure live webhook subscriptions.
        </p>
      ) : (
        <div className="space-y-4 rounded-lg border bg-muted/20 p-4 sm:p-5">
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-sm font-medium text-foreground">
              Webhook URL
            </Label>
            <Input
              id="webhook-url"
              placeholder="https://api.extrahand.com/webhooks/whatsapp-ops"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={!canManage || saveMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-secret" className="text-sm font-medium text-foreground">
              Signing secret
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="webhook-secret"
                type="password"
                className="flex-1"
                placeholder={
                  configQuery.data?.hasSecret ? 'Leave blank to keep existing secret' : 'Min 16 characters'
                }
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                disabled={!canManage || saveMutation.isPending}
              />
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={handleGenerateSecret}
                disabled={!canManage || saveMutation.isPending}
              >
                Generate
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Switch
                id="webhook-enabled"
                checked={enabled}
                onCheckedChange={setEnabled}
                disabled={!canManage || saveMutation.isPending}
              />
              <Label htmlFor="webhook-enabled" className="text-sm font-medium text-foreground">
                Enabled
              </Label>
            </div>
            <div className="flex items-center justify-end gap-3">
              {savedMessage ? (
                <span className="text-sm text-emerald-600 dark:text-emerald-400">{savedMessage}</span>
              ) : null}
              <Button
                onClick={handleSave}
                disabled={!canManage || saveMutation.isPending || !url.trim() || needsSecret}
              >
                {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save configuration
              </Button>
            </div>
          </div>
        </div>
      )}

      <DocSubsection title="Events">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[180px]">Event</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WEBHOOK_EVENTS.map((row) => (
                <TableRow key={row.event}>
                  <TableCell className="font-mono text-xs">{row.event}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.when}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DocSubsection>

      <DocSubsection title="Payload example">
        <CodeSnippet code={WEBHOOK_PAYLOAD_EXAMPLE} />
        <p className="text-sm text-muted-foreground">
          Verify the webhook HMAC signature header on each POST (
          <code className="text-foreground">sha256=…</code>).
        </p>
      </DocSubsection>
    </IntegrationDocCard>
  );
}
