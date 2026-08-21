import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PlatformPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  className?: string;
};

export function PlatformPageHeader({
  title,
  description,
  actions,
  toolbar,
  className,
}: PlatformPageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      {toolbar ? <div>{toolbar}</div> : null}
    </div>
  );
}
