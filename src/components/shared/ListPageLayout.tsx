import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ListPageShellProps = {
  children: ReactNode;
  className?: string;
};

export function ListPageShell({ children, className }: ListPageShellProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

type FilterPanelProps = {
  children: ReactNode;
  /** Primary actions aligned with filters on large screens */
  actions?: ReactNode;
  /** How actions align vertically with the filter row */
  align?: 'end' | 'center';
  className?: string;
};

export function FilterPanel({ children, actions, align = 'end', className }: FilterPanelProps) {
  return (
    <Card className={cn('border-border/70 shadow-none', className)}>
      <CardContent className="p-3 sm:p-4">
        {actions ? (
          <div
            className={cn(
              'flex flex-col gap-3 lg:flex-row lg:gap-4',
              align === 'center' ? 'lg:items-center' : 'lg:items-end',
            )}
          >
            <div className="min-w-0 flex-1">{children}</div>
            <div className="flex w-full shrink-0 flex-wrap items-stretch gap-2 sm:items-center lg:w-auto lg:justify-end">
              {actions}
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

type TablePanelProps = {
  children: ReactNode;
  className?: string;
};

export function TablePanel({ children, className }: TablePanelProps) {
  return (
    <Card className={cn('overflow-hidden border-border/70 shadow-none', className)}>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
