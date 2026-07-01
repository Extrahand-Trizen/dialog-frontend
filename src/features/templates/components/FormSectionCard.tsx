import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FormSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function FormSectionCard({
  title,
  description,
  children,
  action,
  className,
}: FormSectionCardProps) {
  return (
    <Card className={cn('overflow-hidden shadow-sm', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b bg-muted/25 px-5 py-4">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5">{children}</CardContent>
    </Card>
  );
}
