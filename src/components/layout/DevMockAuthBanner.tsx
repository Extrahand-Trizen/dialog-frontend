import { FlaskConical } from 'lucide-react';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';

export function DevMockAuthBanner() {
  if (!isDevMockAuthEnabled()) return null;

  return (
    <div
      role="status"
      className="flex shrink-0 items-center justify-center gap-2 border-b border-amber-500/20 bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
    >
      <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        Dev mock auth — sample data on all screens. Connect backend + login for live API data.
      </span>
    </div>
  );
}
