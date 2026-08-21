import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type PlatformBackLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
};

export function PlatformBackLink({ to, children, className }: PlatformBackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {children}
    </Link>
  );
}

type PlatformSectionHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PlatformSectionHeader({
  title,
  description,
  actions,
  className,
}: PlatformSectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="min-w-0 space-y-1">
        <h2 className="text-sm font-medium tracking-tight text-foreground">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

type PlatformStatusPillProps = {
  active?: boolean;
  label?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'muted';
  className?: string;
};

const TONE_CLASS: Record<NonNullable<PlatformStatusPillProps['tone']>, string> = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  danger: 'bg-destructive/10 text-destructive',
  muted: 'bg-muted text-muted-foreground',
};

export function PlatformStatusPill({
  active,
  label,
  tone,
  className,
}: PlatformStatusPillProps) {
  const resolvedTone =
    tone ?? (active === undefined ? 'muted' : active ? 'success' : 'muted');
  const resolvedLabel = label ?? (active ? 'Active' : 'Inactive');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide',
        TONE_CLASS[resolvedTone],
        className,
      )}
    >
      {resolvedLabel}
    </span>
  );
}

export function getWhatsAppStatusTone(
  status: 'ACTIVE' | 'ERROR' | 'DISCONNECTED',
): NonNullable<PlatformStatusPillProps['tone']> {
  if (status === 'ACTIVE') {
    return 'success';
  }
  if (status === 'ERROR') {
    return 'danger';
  }
  return 'muted';
}

export function getWhatsAppStatusLabel(
  status: 'ACTIVE' | 'ERROR' | 'DISCONNECTED',
): string {
  if (status === 'ACTIVE') {
    return 'Active';
  }
  if (status === 'ERROR') {
    return 'Error';
  }
  return 'Disconnected';
}

type PlatformInitialsProps = {
  name: string;
  className?: string;
};

export function PlatformInitials({ name, className }: PlatformInitialsProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground',
        className,
      )}
      aria-hidden
    >
      {initials || '?'}
    </div>
  );
}

type PlatformStatProps = {
  label: string;
  value: string | number;
};

export function PlatformStat({ label, value }: PlatformStatProps) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-lg font-semibold tabular-nums tracking-tight">{value}</p>
    </div>
  );
}
