import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlatformAuth } from '@/features/platform-admin/context/PlatformAuthProvider';
import { getPlatformAdminDisplayName } from '@/features/platform-admin/types';

export function PlatformAdminLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = usePlatformAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.07] via-background to-background">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/platform" className="group flex min-w-0 items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-transform group-hover:scale-[1.02]">
              <ShieldCheck className="size-4" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold leading-none tracking-tight">
                Platform Admin
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">Organizations & WhatsApp</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {admin ? (
              <div className="hidden text-right sm:block">
                <p className="max-w-[10rem] truncate text-sm font-medium leading-none">
                  {getPlatformAdminDisplayName(admin)}
                </p>
                <p className="mt-1.5 max-w-[10rem] truncate text-[11px] text-muted-foreground">
                  {admin.email}
                </p>
              </div>
            ) : null}
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-muted-foreground" onClick={logout}>
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
