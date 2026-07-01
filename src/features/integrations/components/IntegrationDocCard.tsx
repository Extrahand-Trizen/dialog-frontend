import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type HttpMethod = 'POST' | 'GET';

const METHOD_STYLES: Record<HttpMethod, string> = {
  POST: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  GET: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400',
};

type IntegrationDocCardProps = {
  id?: string;
  title: string;
  method?: HttpMethod;
  path?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function IntegrationDocCard({
  id,
  title,
  method,
  path,
  description,
  children,
  className,
}: IntegrationDocCardProps) {
  return (
    <Card id={id} className={cn('overflow-hidden shadow-sm', className)}>
      <CardHeader className="border-b bg-muted/25 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {method ? (
            <Badge variant="outline" className={cn('font-mono text-[11px]', METHOD_STYLES[method])}>
              {method}
            </Badge>
          ) : null}
          <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        </div>
        {path ? (
          <code className="mt-2 block rounded-md border bg-background px-3 py-2 text-xs break-all text-foreground">
            {path}
          </code>
        ) : null}
        {description ? (
          <CardDescription className="mt-2 text-sm leading-relaxed">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-5">{children}</CardContent>
    </Card>
  );
}

type DocSubsectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function DocSubsection({ title, children, className }: DocSubsectionProps) {
  return (
    <section className={cn('space-y-2', className)}>
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      {children}
    </section>
  );
}
