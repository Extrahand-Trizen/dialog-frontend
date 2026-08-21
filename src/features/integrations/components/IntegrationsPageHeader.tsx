import { Link } from 'react-router-dom';
import { KeyRound, Plug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/features/integrations/constants';

export function IntegrationsPageHeader() {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Plug className="size-4" strokeWidth={2.25} />
          </div>
          <h2 className="font-display text-lg font-semibold tracking-tight">Integrations</h2>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Send approved templates from your backend and receive delivery events on your server.
        </p>
        <code className="inline-block max-w-full truncate rounded-md border border-border/70 bg-muted/40 px-2 py-1 text-xs">
          {API_BASE_URL}
        </code>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm" className="h-8">
          <Link to="/api-keys">
            <KeyRound className="mr-1.5 size-3.5" />
            API keys
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="h-8">
          <Link to="/whatsapp">WhatsApp setup</Link>
        </Button>
      </div>
    </div>
  );
}
