import { ListPageShell } from '@/components/shared/ListPageLayout';
import {
  OperatorWorkflowCard,
  ResponseFormatCard,
  SendApiCard,
  TemplatesApiCard,
} from '@/features/integrations/components/ApiReferenceSection';
import { IntegrationsPageHeader } from '@/features/integrations/components/IntegrationsPageHeader';
import { IntegrationsSectionHeading } from '@/features/integrations/components/IntegrationsSectionHeading';
import { OutboundWebhookCard } from '@/features/integrations/components/OutboundWebhookCard';

export function IntegrationsPage() {
  return (
    <ListPageShell>
      <IntegrationsPageHeader />
      <OperatorWorkflowCard />

      <div className="space-y-4">
        <IntegrationsSectionHeading
          title="API reference"
          description="Endpoints for sending messages and managing templates."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <SendApiCard />
          <TemplatesApiCard />
          <ResponseFormatCard />
        </div>
      </div>

      <div className="space-y-4">
        <IntegrationsSectionHeading
          title="Event delivery"
          description="Receive message status updates on your server instead of polling."
        />
        <OutboundWebhookCard />
      </div>
    </ListPageShell>
  );
}
