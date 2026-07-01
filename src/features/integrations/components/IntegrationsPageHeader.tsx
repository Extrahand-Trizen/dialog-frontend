import { Link } from 'react-router-dom';
import { KeyRound, Plug, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { API_BASE_URL } from '@/features/integrations/constants';

export function IntegrationsPageHeader() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Plug className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 space-y-1">
            <h2 className="text-base font-semibold text-foreground">Connect your backend</h2>
            <p className="text-sm text-muted-foreground">
              Send approved templates via API and receive delivery events through outbound webhooks.
            </p>
            <code className="mt-1 inline-block max-w-full truncate rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-foreground">
              {API_BASE_URL}
            </code>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link to="/api-keys">
              <KeyRound className="mr-2 h-4 w-4" />
              API keys
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/whatsapp">
              <Workflow className="mr-2 h-4 w-4" />
              WhatsApp setup
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
