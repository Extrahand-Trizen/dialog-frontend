import {
  OperatorWorkflowCard,
  ResponseFormatCard,
  SendApiCard,
  TemplatesApiCard,
} from '@/features/integrations/components/ApiReferenceSection';
import { IntegrationsPageHeader } from '@/features/integrations/components/IntegrationsPageHeader';
import { OutboundWebhookCard } from '@/features/integrations/components/OutboundWebhookCard';

export function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <IntegrationsPageHeader />
      <OperatorWorkflowCard />

      <section className="space-y-4">
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight">API reference</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Endpoints for sending messages and managing templates.
          </p>
        </div>
        <div className="space-y-4">
          <SendApiCard />
          <div className="grid gap-4 lg:grid-cols-2">
            <TemplatesApiCard />
            <ResponseFormatCard />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight">Event delivery</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Receive message status updates on your server instead of polling.
          </p>
        </div>
        <OutboundWebhookCard />
      </section>
    </div>
  );
}
