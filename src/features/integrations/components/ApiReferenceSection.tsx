import { Link } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  API_BASE_URL,
  SEND_ERROR_ROWS,
  SEND_EXAMPLE,
  SEND_FIELD_ROWS,
  SEND_SUCCESS_EXAMPLE,
  TEMPLATE_CREATE_EXAMPLE,
  MEDIA_UPLOAD_EXAMPLE,
} from '@/features/integrations/constants';

const CURL_EXAMPLE = `curl -X POST "${API_BASE_URL}/messages" \\
  -H "Authorization: Bearer td_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${SEND_EXAMPLE.replace(/\n/g, '\n  ')}'`;

export function SendApiCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>POST /messages</CardTitle>
        <CardDescription>
          Send an approved WhatsApp template. API key with{' '}
          <code className="text-foreground">messages:write</code> scope.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Endpoint</p>
          <code className="mt-1 block rounded-md bg-muted px-3 py-2 text-sm break-all">
            POST {API_BASE_URL}/messages
          </code>
        </div>

        <div>
          <p className="text-sm font-medium">Request fields</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SEND_FIELD_ROWS.map((row) => (
                <TableRow key={row.field}>
                  <TableCell>
                    <code>{row.field}</code>
                  </TableCell>
                  <TableCell>{row.required ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-muted-foreground">{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <p className="text-sm font-medium">Request body</p>
          <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {SEND_EXAMPLE}
          </pre>
        </div>

        <div>
          <p className="text-sm font-medium">Success response</p>
          <p className="mt-1 text-sm text-muted-foreground">
            <code className="text-foreground">202 Accepted</code> for new sends;{' '}
            <code className="text-foreground">200 OK</code> when{' '}
            <code className="text-foreground">duplicate: true</code> (same idempotencyKey).
          </p>
          <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {SEND_SUCCESS_EXAMPLE}
          </pre>
        </div>

        <div>
          <p className="text-sm font-medium">Common errors</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>errorCode</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SEND_ERROR_ROWS.map((row) => (
                <TableRow key={row.code}>
                  <TableCell>
                    <code>{row.code}</code>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.when}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <p className="text-sm font-medium">cURL</p>
          <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {CURL_EXAMPLE}
          </pre>
        </div>

        <p className="text-sm text-muted-foreground">
          Poll status via{' '}
          <code className="text-foreground">GET /messages?idempotencyKey=…</code> or{' '}
          <code className="text-foreground">GET /messages/:id</code> (JWT). Prefer outbound
          webhooks for delivery updates.
        </p>
      </CardContent>
    </Card>
  );
}

export function TemplatesApiCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>POST /templates</CardTitle>
        <CardDescription>
          Create and submit templates to Meta. Requires admin JWT (operator UI), not API key.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Endpoint</p>
          <code className="mt-1 block rounded-md bg-muted px-3 py-2 text-sm break-all">
            POST {API_BASE_URL}/templates
          </code>
        </div>
        <div>
          <p className="text-sm font-medium">Request body</p>
          <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {TEMPLATE_CREATE_EXAMPLE}
          </pre>
        </div>
        <p className="text-sm text-muted-foreground">
          Use named placeholders like{' '}
          <code className="text-foreground">{'{{customerName}}'}</code> in body text. For{' '}
          <strong className="text-foreground">IMAGE</strong> or{' '}
          <strong className="text-foreground">VIDEO</strong> headers, upload media first via{' '}
          <code className="text-foreground">POST /media/upload</code> and pass the returned{' '}
          <code className="text-foreground">handle</code> in{' '}
          <code className="text-foreground">header.format</code> +{' '}
          <code className="text-foreground">header.handle</code>. The create UI on{' '}
          <Link to="/templates/new" className="text-primary underline-offset-4 hover:underline">
            New template
          </Link>{' '}
          uploads automatically.
        </p>
        <div>
          <p className="text-sm font-medium">Media upload (before template create)</p>
          <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {MEDIA_UPLOAD_EXAMPLE}
          </pre>
          <p className="mt-2 text-xs text-muted-foreground">
            Requires admin JWT and server env <code className="text-foreground">META_APP_ID</code>.
            JPEG/PNG up to 5 MB; MP4 up to 16 MB.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResponseFormatCard() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Response format</CardTitle>
        <CardDescription>
          The platform uses a consistent JSON envelope — not MyOperator&apos;s status/code wrapper.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed text-foreground">{`{
  "success": true | false,
  "message": "Human-readable summary",
  "data": { ... } | null,
  "meta": { "page", "limit", "total" } // paginated lists only
}

// Error:
{
  "success": false,
  "message": "...",
  "errorCode": "VALIDATION_ERROR",
  "details": { ... } // optional
}`}</pre>
        <p>
          Create API keys in{' '}
          <Link to="/api-keys" className="text-primary underline-offset-4 hover:underline">
            API Keys
          </Link>{' '}
          with <code className="text-foreground">messages:write</code>. Pass{' '}
          <code className="text-foreground">Authorization: Bearer td_…</code> on integrator calls.
        </p>
      </CardContent>
    </Card>
  );
}

export function OperatorWorkflowCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operator workflow</CardTitle>
        <CardDescription>From zero to production sends.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            Connect WhatsApp under{' '}
            <Link to="/whatsapp" className="text-primary underline-offset-4 hover:underline">
              WhatsApp
            </Link>
            .
          </li>
          <li>
            Create templates in{' '}
            <Link to="/templates" className="text-primary underline-offset-4 hover:underline">
              Templates
            </Link>{' '}
            and wait for Meta approval.
          </li>
          <li>
            Create an API key with Send messages scope.
          </li>
          <li>Configure outbound webhooks below (optional but recommended).</li>
          <li>
            Integrate <code className="text-foreground">POST /messages</code> from ExtraHand or
            other backends.
          </li>
        </ol>
      </CardContent>
    </Card>
  );
}
