import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlatformAuth } from '@/features/platform-admin/context/PlatformAuthProvider';
import { getPlatformAdminDisplayName } from '@/features/platform-admin/types';

export function PlatformAdminLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = usePlatformAuth();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="size-4" strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">TrizenDialog</p>
              <p className="text-xs text-muted-foreground">Platform Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {admin ? (
              <span className="text-sm text-muted-foreground">
                {getPlatformAdminDisplayName(admin)}
              </span>
            ) : null}
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
