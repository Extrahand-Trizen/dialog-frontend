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
  '/calls': {
    title: 'Calls',
    description: 'Voice calling through Trizen virtual numbers — coming soon.',
  },
  '/calls/settings': {
    title: 'Calling',
    description: 'Voice preferences for outbound calls from Dialog.',
  },
  '/calls/notifications': {
    title: 'Notifications',
    description: 'Missed calls, completed calls, and WhatsApp activity.',
  },
  '/calls/conversations': {
    title: 'Conversation',
    description: 'Chat timeline with call activity.',
  },
  '/calls/contacts': {
    title: 'Contact',
    description: 'Call, WhatsApp, and recent call activity.',
  },
  '/campaigns': {
    title: 'Campaigns',
    description: 'Send one approved template to many recipients.',
  },
  '/campaigns/history': {
    title: 'History',
    description: 'Past campaign sends.',
  },
  '/campaigns/history/:id': {
    title: 'Campaign',
    description: 'Results for this send.',
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
    description: 'Keys for WhatsApp messaging and the Trizen Voice API.',
  },
  '/virtual-numbers': {
    title: 'Virtual Numbers',
    description: 'Trizen virtual numbers for business calling — coming soon.',
  },
  '/virtual-numbers/get': {
    title: 'Get a Virtual Number',
    description: 'Number purchase for calling is coming soon.',
  },
  '/virtual-numbers/:id': {
    title: 'Number details',
    description: 'Capabilities, call routing, webhooks, and usage.',
  },
  '/developer/voice': {
    title: 'Trizen Voice API',
    description: 'Add calling to your website or application using your Trizen virtual number.',
  },
  '/developer/webhooks': {
    title: 'Webhooks',
    description: 'Receive normalized Trizen call events on your server.',
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
      : pathname.startsWith('/calls/conversations/')
        ? PAGE_TITLES['/calls/conversations']
        : pathname.startsWith('/calls/contacts/')
          ? PAGE_TITLES['/calls/contacts']
          : pathname.startsWith('/campaigns/history/')
            ? PAGE_TITLES['/campaigns/history/:id']
          : pathname.startsWith('/virtual-numbers/') && pathname !== '/virtual-numbers/get'
            ? PAGE_TITLES['/virtual-numbers/:id']
          : { title: APP_NAME });

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="border-l border-border/40 bg-background">
        <div className="sticky top-0 z-20 border-b border-border/50 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
          <DevMockAuthBanner />
          <TopNav pageTitle={page.title} description={page.description} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 lg:p-6">
          <div className="mx-auto w-full min-w-0 max-w-7xl flex-1">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
