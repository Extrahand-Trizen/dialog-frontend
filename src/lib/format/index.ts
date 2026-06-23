const EMPTY = '—';

/** UTC ISO string → local date (medium). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return EMPTY;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(iso));
}

/** UTC ISO string → local date + time (medium + short). */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return EMPTY;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return EMPTY;
  // API rates are fractions (0–1); values already in 0–100 pass through unchanged.
  const pct = value >= 0 && value <= 1 ? value * 100 : value;
  return `${pct.toFixed(1)}%`;
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return EMPTY;
  return phone;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return EMPTY;
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder > 0 ? `${minutes}m ${remainder}s` : `${minutes}m`;
}

export function formatCurrency(
  amount: number | null | undefined,
  currency = 'INR',
): string {
  if (amount === null || amount === undefined) return EMPTY;
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
}
