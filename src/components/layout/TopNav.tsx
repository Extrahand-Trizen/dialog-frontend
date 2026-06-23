import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenu } from '@/components/layout/UserMenu';

type TopNavProps = {
  pageTitle: string;
  description?: string;
};

export function TopNav({ pageTitle, description }: TopNavProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
            {pageTitle}
          </h1>
          {description ? (
            <p className="hidden truncate text-sm text-muted-foreground md:block">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <UserMenu />
    </header>
  );
}
