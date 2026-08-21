import { cn } from '@/lib/utils';

const MESSAGE_STATUS_META: Record<
  string,
  { label: string; dot: string; chip: string }
> = {
  QUEUED: {
    label: 'Queued',
    dot: 'bg-slate-400',
    chip: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
  },
  SENT: {
    label: 'Sent',
    dot: 'bg-sky-500',
    chip: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:ring-sky-800',
  },
  DELIVERED: {
    label: 'Delivered',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800',
  },
  READ: {
    label: 'Read',
    dot: 'bg-violet-500',
    chip: 'bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:ring-violet-800',
  },
  FAILED: {
    label: 'Failed',
    dot: 'bg-destructive',
    chip: 'bg-destructive/10 text-destructive ring-destructive/20',
  },
};

type MessageStatusPillProps = {
  status: string;
  className?: string;
  /** Show Meta-style uppercase code next to the label */
  showCode?: boolean;
};

export function messageStatusLabel(status: string): string {
  return MESSAGE_STATUS_META[status]?.label ?? status;
}

export function MessageStatusPill({ status, className, showCode = false }: MessageStatusPillProps) {
  const meta = MESSAGE_STATUS_META[status] ?? {
    label: status,
    dot: 'bg-muted-foreground',
    chip: 'bg-muted text-muted-foreground ring-border',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        meta.chip,
        className,
      )}
      title={status}
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', meta.dot)} aria-hidden />
      <span>{meta.label}</span>
      {showCode && meta.label !== status ? (
        <span className="font-mono text-[10px] opacity-60">{status}</span>
      ) : null}
    </span>
  );
}
