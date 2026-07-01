import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { getUserDisplayName, getUserInitials } from '@/features/auth/types';
import { cn } from '@/lib/utils';

export function SidebarUserFooter() {
  const { user } = useAuth();

  if (!user) return null;

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={displayName}
          className="h-auto rounded-lg border border-sidebar-border bg-background p-2.5 shadow-none hover:bg-background"
        >
          <Link to="/profile" className="flex w-full items-center gap-3">
            <Avatar className="size-8 shrink-0 rounded-md">
              <AvatarFallback className="rounded-md bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold leading-tight text-sidebar-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs font-medium leading-tight text-muted-foreground">
                {user.organizationSlug}
              </p>
            </div>
            <ChevronRight
              className={cn(
                'size-4 shrink-0 text-muted-foreground',
                'group-data-[collapsible=icon]:hidden',
              )}
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
