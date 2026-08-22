import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ComingSoonNotice } from '@/features/voice/ComingSoon';

export function VoiceWebhooksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <ComingSoonNotice description="Call event webhooks will go live with Trizen Voice. Contact calling is coming soon." />
      <div>
        <p className="text-sm font-medium">Voice webhooks</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Set a webhook URL on each virtual number. Trizen sends normalized call events — never the
          underlying telecom payload.
        </p>
      </div>

      <Card className="border-border/70 shadow-none">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm font-semibold">Events</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li><code className="text-xs">call.initiated</code></li>
            <li><code className="text-xs">call.ringing</code></li>
            <li><code className="text-xs">call.answered</code></li>
            <li><code className="text-xs">call.completed</code></li>
            <li><code className="text-xs">call.failed</code></li>
            <li><code className="text-xs">call.busy</code></li>
            <li><code className="text-xs">call.no_answer</code></li>
            <li><code className="text-xs">call.ended</code></li>
            <li><code className="text-xs">recording.available</code></li>
          </ul>
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed">
            {`{
  "event": "call.ringing",
  "callId": "…",
  "virtualNumber": "+91 XXXXX XXXXX",
  "direction": "outgoing",
  "status": "ringing"
}`}
          </pre>
          <Button asChild variant="outline" size="sm">
            <Link to="/virtual-numbers">Configure on a number</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
