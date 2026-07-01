import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DevMockAuthBanner } from '@/components/layout/DevMockAuthBanner';
import { TopNav } from '@/components/layout/TopNav';
import { APP_NAME } from '@/constants/branding';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, { title: string; description?: string }> = {
  '/overview': {
    title: 'Overview',
    description: 'Message delivery metrics for your organization.',
  },
  '/messages': {
    title: 'Messages',
    description: 'Outbound WhatsApp messages and delivery status.',
  },
  '/templates': {
    title: 'Templates',
    description: 'Create, submit, and manage WhatsApp message templates.',
  },
  '/templates/new': {
    title: 'Create template',
    description: 'Compose header, body, and footer — submitted to Meta for approval.',
  },
  '/templates/:templateId/edit': {
    title: 'Edit template',
    description: 'Update message content and resubmit to Meta for approval.',
  },
  '/integrations': {
    title: 'Integrations',
    description: 'API reference for sending template messages from your backends.',
  },
  '/profile': { title: 'Profile', description: 'Account details from the active session.' },
  '/whatsapp': {
    title: 'WhatsApp',
    description: 'Manage connected WhatsApp Business accounts and phone numbers.',
  },
  '/api-keys': {
    title: 'API Keys',
    description: 'Create and revoke keys for sending messages via the platform API.',
  },
};

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation();
  const page =
    PAGE_TITLES[pathname] ??
    (/^\/templates\/[^/]+\/edit$/.test(pathname)
      ? PAGE_TITLES['/templates/:templateId/edit']
      : { title: APP_NAME });

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="border-l border-border/50 bg-background">
        <div className="sticky top-0 z-20 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <DevMockAuthBanner />
          <TopNav pageTitle={page.title} description={page.description} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
          <div className="mx-auto w-full min-w-0 max-w-7xl flex-1">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
