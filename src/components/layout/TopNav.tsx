import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenu } from '@/components/layout/UserMenu';

type TopNavProps = {
  pageTitle: string;
  description?: string;
};

export function TopNav({ pageTitle, description }: TopNavProps) {
  return (
    <header className="flex min-h-12 shrink-0 items-center justify-between gap-3 px-4 py-2 sm:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {/* Mobile only — desktop collapse lives inside the sidebar */}
        <SidebarTrigger className="size-8 shrink-0 rounded-lg text-foreground/70 hover:text-foreground md:hidden" />
        <div className="min-w-0">
          <h1 className="truncate font-display text-base font-semibold tracking-tight text-foreground">
            {pageTitle}
          </h1>
          {description ? (
            <p className="mt-0.5 hidden truncate text-xs leading-snug text-muted-foreground sm:block">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <UserMenu />
    </header>
  );
}
