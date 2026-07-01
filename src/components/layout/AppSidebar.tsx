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
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  FileText,
  Key,
  MessageSquare,
  MessagesSquare,
  Phone,
  Plug,
  User,
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
      { title: 'Integrations', url: '/integrations', icon: Plug },
      { title: 'Profile', url: '/profile', icon: User },
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
    label: 'Administration',
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
          'h-9 rounded-lg px-3 text-sm font-medium transition-colors',
          isActive
            ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-none'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
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
              'size-[18px] shrink-0 stroke-[2px]',
              isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/80',
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
  const showAdminNav = canViewAdminNav(user);

  const visibleSections = navSections
    .filter((section) => !section.adminOnly || showAdminNav)
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.adminOnly || showAdminNav),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip={APP_NAME}
              className="h-10 rounded-lg px-2 hover:bg-transparent active:bg-transparent data-[state=open]:hover:bg-transparent"
            >
              <Link to="/overview" className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <MessageSquare className="size-4" strokeWidth={2.25} />
                </div>
                <span className="truncate text-base font-semibold tracking-tight text-sidebar-foreground">
                  {APP_NAME}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {visibleSections.map((section, index) => (
          <div key={section.label}>
            {index > 0 ? <SidebarSeparator className="mb-4 bg-sidebar-border" /> : null}
            <SidebarGroup className="p-0 pb-4 last:pb-0">
              <SidebarGroupLabel className="mb-1.5 h-auto px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75">
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

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarUserFooter />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
