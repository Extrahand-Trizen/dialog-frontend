import { ListPageShell } from '@/components/shared/ListPageLayout';
import {
  OperatorWorkflowCard,
  ResponseFormatCard,
  SendApiCard,
  TemplatesApiCard,
} from '@/features/integrations/components/ApiReferenceSection';
import { OutboundWebhookCard } from '@/features/integrations/components/OutboundWebhookCard';

export function IntegrationsPage() {
  return (
    <ListPageShell>
      <div className="grid gap-6 lg:grid-cols-2">
        <SendApiCard />
        <OperatorWorkflowCard />
        <TemplatesApiCard />
        <ResponseFormatCard />
        <OutboundWebhookCard />
      </div>
    </ListPageShell>
  );
}
