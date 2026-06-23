import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ListPageShellProps = {
  children: ReactNode;
  className?: string;
};

export function ListPageShell({ children, className }: ListPageShellProps) {
  return <div className={cn('space-y-6', className)}>{children}</div>;
}

type FilterPanelProps = {
  children: ReactNode;
  className?: string;
};

export function FilterPanel({ children, className }: FilterPanelProps) {
  return (
    <Card className={cn('shadow-sm', className)}>
      <CardContent className="p-3 sm:p-5">{children}</CardContent>
    </Card>
  );
}

type TablePanelProps = {
  children: ReactNode;
  className?: string;
};

export function TablePanel({ children, className }: TablePanelProps) {
  return (
    <Card className={cn('overflow-hidden shadow-sm', className)}>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
