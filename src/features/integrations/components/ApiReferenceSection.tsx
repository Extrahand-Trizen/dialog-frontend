import { Link } from 'react-router-dom';
import { ArrowRight, FileText, KeyRound, MessageSquare, Webhook } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CodeSnippet } from '@/features/integrations/components/CodeSnippet';
import { DocSubsection, IntegrationDocCard } from '@/features/integrations/components/IntegrationDocCard';
import {
  API_BASE_URL,
  SEND_ERROR_ROWS,
  SEND_EXAMPLE,
  SEND_FIELD_ROWS,
  SEND_SUCCESS_EXAMPLE,
  TEMPLATE_CREATE_EXAMPLE,
  MEDIA_UPLOAD_EXAMPLE,
} from '@/features/integrations/constants';
import { cn } from '@/lib/utils';

const CURL_EXAMPLE = `curl -X POST "${API_BASE_URL}/messages" \\
  -H "Authorization: Bearer td_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${SEND_EXAMPLE.replace(/\n/g, '\n  ')}'`;

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Connect WhatsApp',
    description: 'Link your Meta WhatsApp Business Account.',
    href: '/whatsapp',
    icon: MessageSquare,
  },
  {
    step: 2,
    title: 'Create templates',
    description: 'Submit templates and wait for Meta approval.',
    href: '/templates',
    icon: FileText,
  },
  {
    step: 3,
    title: 'Create API key',
    description: 'Generate a key with Send messages scope.',
    href: '/api-keys',
    icon: KeyRound,
  },
  {
    step: 4,
    title: 'Configure webhooks',
    description: 'Receive delivery updates on your backend.',
    href: '#outbound-webhooks',
    icon: Webhook,
  },
  {
    step: 5,
    title: 'Send messages',
    description: 'Call POST /messages from your services.',
    href: '#send-api',
    icon: ArrowRight,
  },
] as const;

function DocTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-lg border', className)}>
      <Table>{children}</Table>
    </div>
  );
}

export function SendApiCard() {
  return (
    <IntegrationDocCard
      id="send-api"
      title="/messages"
      method="POST"
      path={`POST ${API_BASE_URL}/messages`}
      description={
        <>
          Send an approved WhatsApp template. Requires an API key with{' '}
          <code className="text-foreground">messages:write</code> scope.
        </>
      }
    >
      <DocSubsection title="Request fields">
        <DocTable>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[140px]">Field</TableHead>
              <TableHead className="w-[90px]">Required</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SEND_FIELD_ROWS.map((row) => (
              <TableRow key={row.field}>
                <TableCell className="font-mono text-xs">{row.field}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      row.required ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {row.required ? 'Yes' : 'No'}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DocTable>
      </DocSubsection>

      <CodeSnippet label="Request body" code={SEND_EXAMPLE} />

      <DocSubsection title="Success response">
        <p className="text-sm text-muted-foreground">
          <code className="text-foreground">202 Accepted</code> for new sends;{' '}
          <code className="text-foreground">200 OK</code> when{' '}
          <code className="text-foreground">duplicate: true</code> (same idempotencyKey).
        </p>
        <CodeSnippet code={SEND_SUCCESS_EXAMPLE} />
      </DocSubsection>

      <DocSubsection title="Common errors">
        <DocTable>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[200px]">errorCode</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SEND_ERROR_ROWS.map((row) => (
              <TableRow key={row.code}>
                <TableCell className="font-mono text-xs">{row.code}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.when}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DocTable>
      </DocSubsection>

      <CodeSnippet label="cURL" code={CURL_EXAMPLE} />

      <p className="text-sm text-muted-foreground">
        Poll status via <code className="text-foreground">GET /messages?idempotencyKey=…</code> or{' '}
        <code className="text-foreground">GET /messages/:id</code> (JWT). Prefer outbound webhooks
        for delivery updates.
      </p>
    </IntegrationDocCard>
  );
}

export function TemplatesApiCard() {
  return (
    <IntegrationDocCard
      title="/templates"
      method="POST"
      path={`POST ${API_BASE_URL}/templates`}
      description="Create and submit templates to Meta. Requires admin JWT (operator UI), not API key."
    >
      <CodeSnippet label="Request body" code={TEMPLATE_CREATE_EXAMPLE} />

      <p className="text-sm leading-relaxed text-muted-foreground">
        Use named placeholders like <code className="text-foreground">{'{{customerName}}'}</code> in
        body text. For <strong className="text-foreground">IMAGE</strong> or{' '}
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

      <CodeSnippet label="Media upload (before template create)" code={MEDIA_UPLOAD_EXAMPLE} />

      <p className="text-xs text-muted-foreground">
        Requires admin JWT and server env <code className="text-foreground">META_APP_ID</code>.
        JPEG/PNG up to 5 MB; MP4 up to 16 MB.
      </p>
    </IntegrationDocCard>
  );
}

export function ResponseFormatCard() {
  return (
    <IntegrationDocCard
      title="Response format"
      description="The platform uses a consistent JSON envelope — not MyOperator's status/code wrapper."
      className="lg:col-span-2"
    >
      <CodeSnippet
        code={`{
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
}`}
      />
      <p className="text-sm leading-relaxed text-muted-foreground">
        Create API keys in{' '}
        <Link to="/api-keys" className="text-primary underline-offset-4 hover:underline">
          API Keys
        </Link>{' '}
        with <code className="text-foreground">messages:write</code>. Pass{' '}
        <code className="text-foreground">Authorization: Bearer td_…</code> on integrator calls.
      </p>
    </IntegrationDocCard>
  );
}

export function OperatorWorkflowCard() {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="border-b bg-muted/25 px-5 py-4">
        <CardTitle className="text-base font-semibold text-foreground">Getting started</CardTitle>
        <CardDescription className="text-sm">
          From zero to production sends in five steps.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {WORKFLOW_STEPS.map((item) => {
            const Icon = item.icon;
            const isAnchor = item.href.startsWith('#');
            const content = (
              <>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {item.step}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </>
            );

            if (isAnchor) {
              return (
                <li key={item.step}>
                  <a
                    href={item.href}
                    className="flex h-full gap-3 rounded-lg border bg-background p-3 transition-colors hover:border-primary/30 hover:bg-muted/30"
                  >
                    {content}
                  </a>
                </li>
              );
            }

            return (
              <li key={item.step}>
                <Link
                  to={item.href}
                  className="flex h-full gap-3 rounded-lg border bg-background p-3 transition-colors hover:border-primary/30 hover:bg-muted/30"
                >
                  {content}
                </Link>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
