import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
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
import { useAuth } from '@/features/auth/context/AuthProvider';
import { canViewAdminNav } from '@/lib/permissions';

const mainItems = [
  { title: 'Overview', url: '/overview', icon: BarChart3 },
  { title: 'Messages', url: '/messages', icon: MessagesSquare },
  { title: 'Integrations', url: '/integrations', icon: Plug },
  { title: 'Profile', url: '/profile', icon: User },
] as const;

const whatsAppItems: NavItem[] = [
  { title: 'Templates', url: '/templates', icon: FileText, matchPrefix: true },
  { title: 'Setup', url: '/whatsapp', icon: Phone, matchPrefix: false, adminOnly: true },
];

const adminItems = [{ title: 'API Keys', url: '/api-keys', icon: Key }] as const;

type NavItem = {
  title: string;
  url: string;
  icon: (typeof mainItems)[number]['icon'];
  matchPrefix?: boolean;
  adminOnly?: boolean;
};

function SidebarNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link
          to={item.url}
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
        >
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.matchPrefix) {
    return pathname === item.url || pathname.startsWith(`${item.url}/`);
  }
  return pathname === item.url;
}

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const showAdminNav = canViewAdminNav(user);

  const visibleWhatsAppItems = whatsAppItems.filter((item) => !item.adminOnly || showAdminNav);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="TrizenDialog">
              <Link to="/overview">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MessageSquare className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TrizenDialog</span>
                  <span className="truncate text-xs text-muted-foreground">WhatsApp Ops</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarNavItem
                  key={item.url}
                  item={item}
                  isActive={location.pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>WhatsApp</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleWhatsAppItems.map((item) => (
                <SidebarNavItem
                  key={item.url}
                  item={item}
                  isActive={isNavItemActive(location.pathname, item)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showAdminNav ? (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarNavItem
                    key={item.url}
                    item={item}
                    isActive={location.pathname === item.url}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
