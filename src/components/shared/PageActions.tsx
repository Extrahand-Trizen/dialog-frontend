import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageActionsProps = {
  children: ReactNode;
  className?: string;
};

/** Right-aligned toolbar row for page-level actions (title lives in TopNav). */
export function PageActions({ children, className }: PageActionsProps) {
  return <div className={cn('flex justify-end', className)}>{children}</div>;
}
