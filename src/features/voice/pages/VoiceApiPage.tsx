import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ComingSoonButton, ComingSoonNotice } from '@/features/voice/ComingSoon';

const EXAMPLE = `const response = await fetch("https://YOUR_DIALOG_HOST/api/v1/voice/calls", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.TRIZEN_API_KEY
  },
  body: JSON.stringify({
    virtualNumberId: "YOUR_VIRTUAL_NUMBER_ID",
    to: "91XXXXXXXXXX",
    name: "Website visitor"
  })
});`;

const MASKING_EXAMPLE = `const response = await fetch("https://YOUR_DIALOG_HOST/api/v1/voice/masking/sessions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.TRIZEN_API_KEY
  },
  body: JSON.stringify({
    virtualNumberId: "YOUR_VIRTUAL_NUMBER_ID",
    partyA: "91XXXXXXXXXX",
    partyB: "91YYYYYYYYYY"
  })
});`;

export function VoiceApiPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <ComingSoonNotice description="Voice API and number masking are documented here. Live calling and getting a number are coming soon." />
      <div>
        <p className="text-sm font-medium">Trizen Voice API</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add calling to your website or application using your Trizen virtual number.
        </p>
      </div>

      <Card className="border-border/70 shadow-none">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm font-semibold">Click-to-Call</p>
          <p className="text-sm text-muted-foreground">
            When a visitor clicks Call on your website, your application can send a request to the
            Trizen Voice API and connect the call using your Trizen virtual number.
          </p>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1 py-0.5 text-xs">POST /api/v1/voice/calls</code>
            {' '}
            with an API key. Body: <code className="text-xs">to</code>, optional{' '}
            <code className="text-xs">virtualNumberId</code> and <code className="text-xs">name</code>.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed">
            {EXAMPLE}
          </pre>
          <Button asChild variant="outline" size="sm">
            <Link to="/api-keys">Create an API key</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardContent className="space-y-2 p-5">
          <p className="text-sm font-semibold">Call flow</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Customer clicks Call on your website.</li>
            <li>Your application sends a request to Trizen Voice API.</li>
            <li>Trizen validates the API key and virtual number.</li>
            <li>Trizen sends the call request through its telecom infrastructure.</li>
            <li>The call is connected through your Trizen virtual number.</li>
            <li>Call events are available through webhooks.</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm font-semibold">Number Masking API</p>
          <p className="text-sm text-muted-foreground">
            Connect two parties through a Trizen virtual number without exposing their personal phone
            numbers.
          </p>
          <p className="text-sm text-muted-foreground">
            Party A → Trizen virtual number → Party B. Trizen assigns the virtual number as the caller
            ID and routes the call between both parties.
          </p>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1 py-0.5 text-xs">POST /api/v1/voice/masking/sessions</code>
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed">
            {MASKING_EXAMPLE}
          </pre>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <ComingSoonButton size="default">Get a number · Coming soon</ComingSoonButton>
        <Button asChild variant="outline">
          <Link to="/developer/webhooks">Call event webhooks</Link>
        </Button>
      </div>
    </div>
  );
}
