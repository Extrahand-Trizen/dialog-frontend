import { Link } from 'react-router-dom';
import { ArrowRight, FileText, KeyRound, MessageSquare, Webhook } from 'lucide-react';
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
    description: 'Link your Meta WABA',
    href: '/whatsapp',
    icon: MessageSquare,
  },
  {
    step: 2,
    title: 'Create templates',
    description: 'Submit for Meta approval',
    href: '/templates',
    icon: FileText,
  },
  {
    step: 3,
    title: 'Create API key',
    description: 'messages:write scope',
    href: '/api-keys',
    icon: KeyRound,
  },
  {
    step: 4,
    title: 'Webhooks',
    description: 'Delivery updates',
    href: '#outbound-webhooks',
    icon: Webhook,
  },
  {
    step: 5,
    title: 'Send messages',
    description: 'POST /messages',
    href: '#send-api',
    icon: ArrowRight,
  },
] as const;

function DocTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border/70', className)}>
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
        Use named placeholders like <code className="text-foreground">{'{{customerName}}'}</code>. For
        IMAGE/VIDEO headers, upload media via <code className="text-foreground">POST /media/upload</code>{' '}
        first — or use{' '}
        <Link to="/templates/new" className="text-primary underline-offset-4 hover:underline">
          New template
        </Link>
        .
      </p>
      <CodeSnippet label="Media upload" code={MEDIA_UPLOAD_EXAMPLE} />
    </IntegrationDocCard>
  );
}

export function ResponseFormatCard() {
  return (
    <IntegrationDocCard
      title="Response format"
      description="Consistent JSON envelope for success and error responses."
    >
      <CodeSnippet
        code={`{
  "success": true | false,
  "message": "Human-readable summary",
  "data": { ... } | null,
  "meta": { "page", "limit", "total" } // lists only
}`}
      />
    </IntegrationDocCard>
  );
}

export function OperatorWorkflowCard() {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">Getting started</h3>
        <p className="text-xs text-muted-foreground">Five steps from setup to production sends.</p>
      </div>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {WORKFLOW_STEPS.map((item) => {
          const Icon = item.icon;
          const isAnchor = item.href.startsWith('#');
          const className =
            'flex items-start gap-2.5 rounded-xl border border-border/70 bg-card p-3 transition hover:border-primary/30 hover:bg-muted/30';
          const content = (
            <>
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                {item.step}
              </span>
              <span className="min-w-0 space-y-0.5">
                <span className="flex items-center gap-1 text-sm font-medium">
                  <Icon className="size-3 text-muted-foreground" />
                  {item.title}
                </span>
                <span className="block text-xs text-muted-foreground">{item.description}</span>
              </span>
            </>
          );

          return (
            <li key={item.step}>
              {isAnchor ? (
                <a href={item.href} className={className}>
                  {content}
                </a>
              ) : (
                <Link to={item.href} className={className}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
