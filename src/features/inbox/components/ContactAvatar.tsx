import { cn } from '@/lib/utils';

const AVATAR_PALETTE = [
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
];

function paletteIndexFor(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % AVATAR_PALETTE.length;
  }
  return hash;
}

export function ContactAvatar({ phone, className }: { phone: string; className?: string }) {
  const digits = phone.replace(/\D/g, '');
  const initials = digits.slice(-2) || '?';
  const palette = AVATAR_PALETTE[paletteIndexFor(phone)];

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full text-xs font-semibold',
        palette,
        className ?? 'size-9',
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
