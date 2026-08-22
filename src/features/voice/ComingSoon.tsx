import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ComingSoonNotice({
  title = 'Coming soon',
  description,
}: {
  title?: string;
  description: string;
}) {
  return (
    <div className="min-w-0 max-w-full rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground break-words">{description}</p>
    </div>
  );
}

export function ComingSoonButton({
  className,
  size = 'sm',
  variant = 'default',
  children = 'Coming soon',
}: {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline';
  children?: ReactNode;
}) {
  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      disabled
      className={cn('max-w-full whitespace-normal text-center', className)}
    >
      {children}
    </Button>
  );
}

export function BlurredText({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      className={cn('inline-block max-w-full truncate select-none blur-[5px]', className)}
      aria-hidden
    >
      {value}
    </span>
  );
}

export function BlurredNumber({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return <BlurredText value={value} className={cn('font-mono', className)} />;
}
