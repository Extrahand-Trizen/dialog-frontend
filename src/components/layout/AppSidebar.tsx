import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  FileText,
  Key,
  Megaphone,
  MessageSquare,
  MessagesSquare,
  Phone,
  Plug,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME } from '@/constants/branding';
import { SidebarUserFooter } from '@/components/layout/SidebarUserFooter';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { canViewAdminNav } from '@/lib/permissions';
import { cn } from '@/lib/utils';

type NavItem = {
  title: string;
  url: string;
  icon: typeof BarChart3;
  matchPrefix?: boolean;
  adminOnly?: boolean;
};

type NavSection = {
  label: string;
  items: NavItem[];
  adminOnly?: boolean;
};

const navSections: NavSection[] = [
  {
    label: 'Platform',
    items: [
      { title: 'Overview', url: '/overview', icon: BarChart3 },
      { title: 'Messages', url: '/messages', icon: MessagesSquare },
      { title: 'Campaigns', url: '/campaigns', icon: Megaphone },
      { title: 'Integrations', url: '/integrations', icon: Plug },
    ],
  },
  {
    label: 'WhatsApp',
    items: [
      { title: 'Templates', url: '/templates', icon: FileText, matchPrefix: true },
      { title: 'Setup', url: '/whatsapp', icon: Phone, adminOnly: true },
    ],
  },
  {
    label: 'Admin',
    items: [{ title: 'API Keys', url: '/api-keys', icon: Key }],
    adminOnly: true,
  },
];

function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.matchPrefix) {
    return pathname === item.url || pathname.startsWith(`${item.url}/`);
  }
  return pathname === item.url;
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          'h-8 rounded-lg px-2.5 text-[13px] font-medium transition-colors',
          isActive
            ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-none'
            : 'text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        )}
      >
        <Link
          to={item.url}
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
        >
          <item.icon
            className={cn(
              'size-4 shrink-0 stroke-[2px]',
              isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/70',
            )}
          />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { state } = useSidebar();
  const showAdminNav = canViewAdminNav(user);
  const collapsed = state === 'collapsed';

  const visibleSections = navSections
    .filter((section) => !section.adminOnly || showAdminNav)
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.adminOnly || showAdminNav),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-2">
        <div
          className={cn(
            'flex items-center gap-1',
            collapsed ? 'flex-col gap-1.5' : 'justify-between',
          )}
        >
          <SidebarMenu className={cn(collapsed ? 'w-auto' : 'min-w-0 flex-1')}>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                tooltip={APP_NAME}
                className="h-9 rounded-lg px-1.5 hover:bg-transparent active:bg-transparent data-[state=open]:hover:bg-transparent"
              >
                <Link to="/overview" className="flex items-center gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <MessageSquare className="size-3.5" strokeWidth={2.25} />
                  </div>
                  <span className="truncate font-display text-sm font-semibold tracking-tight text-sidebar-foreground">
                    {APP_NAME}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarTrigger
            className={cn(
              'size-8 shrink-0 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
              collapsed && 'mx-auto',
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {visibleSections.map((section, index) => (
          <div key={section.label}>
            {index > 0 ? <SidebarSeparator className="mb-3 bg-sidebar-border" /> : null}
            <SidebarGroup className="p-0 pb-3 last:pb-0">
              <SidebarGroupLabel className="mb-1 h-auto px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-sidebar-foreground/55">
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.url}
                      item={item}
                      isActive={isNavItemActive(pathname, item)}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarUserFooter />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
