import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createHashRouter,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { AppLayout } from '@/components/layout/AppLayout';
import { RouteErrorBoundary } from '@/components/shared/RouteErrorBoundary';
import { ProtectedRoute } from '@/features/auth/guards/ProtectedRoute';
import { AdminRoute } from '@/features/auth/guards/AdminRoute';
import { ManagerRoute } from '@/features/auth/guards/ManagerRoute';
import { PlatformProtectedRoute } from '@/features/platform-admin/guards/PlatformProtectedRoute';
import { PlatformAdminLayout } from '@/features/platform-admin/components/PlatformAdminLayout';
import { shouldUseHashRouter } from '@/lib/router-mode';

const LandingPage = lazy(() =>
  import('@/features/landing/LandingPage').then((m) => ({ default: m.LandingPage })),
);
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const OverviewPage = lazy(() =>
  import('@/features/dashboard/pages/OverviewPage').then((m) => ({ default: m.OverviewPage })),
);
const MessagesPage = lazy(() =>
  import('@/features/messages/pages/MessagesPage').then((m) => ({ default: m.MessagesPage })),
);
const TemplatesPage = lazy(() =>
  import('@/features/templates/pages/TemplatesPage').then((m) => ({ default: m.TemplatesPage })),
);
const CreateTemplatePage = lazy(() =>
  import('@/features/templates/pages/CreateTemplatePage').then((m) => ({
    default: m.CreateTemplatePage,
  })),
);
const EditTemplatePage = lazy(() =>
  import('@/features/templates/pages/EditTemplatePage').then((m) => ({
    default: m.EditTemplatePage,
  })),
);
const IntegrationsPage = lazy(() =>
  import('@/features/integrations/pages/IntegrationsPage').then((m) => ({
    default: m.IntegrationsPage,
  })),
);
const ProfilePage = lazy(() =>
  import('@/features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const WhatsAppPage = lazy(() =>
  import('@/features/whatsapp/pages/WhatsAppPage').then((m) => ({ default: m.WhatsAppPage })),
);
const ApiKeysPage = lazy(() =>
  import('@/features/api-keys/pages/ApiKeysPage').then((m) => ({ default: m.ApiKeysPage })),
);
const PrivacyPage = lazy(() =>
  import('@/features/legal/pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
);
const TermsPage = lazy(() =>
  import('@/features/legal/pages/TermsPage').then((m) => ({ default: m.TermsPage })),
);
const NotFoundPage = lazy(() =>
  import('@/features/legal/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
const PlatformLoginPage = lazy(() =>
  import('@/features/platform-admin/pages/PlatformLoginPage').then((m) => ({
    default: m.PlatformLoginPage,
  })),
);
const OrganizationsPage = lazy(() =>
  import('@/features/platform-admin/pages/OrganizationsPage').then((m) => ({
    default: m.OrganizationsPage,
  })),
);

function PageLoader() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function withSuspense(element: React.ReactNode) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<PageLoader />}>{element}</Suspense>
    </RouteErrorBoundary>
  );
}

function AuthenticatedLayout() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
}

const routes = [
  { path: '/', element: withSuspense(<LandingPage />) },
  { path: '/login', element: withSuspense(<LoginPage />) },
  { path: '/privacy', element: withSuspense(<PrivacyPage />) },
  { path: '/terms', element: withSuspense(<TermsPage />) },
  { path: '/platform/login', element: withSuspense(<PlatformLoginPage />) },
  {
    path: '/platform',
    element: withSuspense(
      <PlatformProtectedRoute>
        <PlatformAdminLayout>
          <OrganizationsPage />
        </PlatformAdminLayout>
      </PlatformProtectedRoute>,
    ),
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      { path: '/overview', element: withSuspense(<OverviewPage />) },
      { path: '/templates', element: withSuspense(<TemplatesPage />) },
      {
        path: '/templates/new',
        element: withSuspense(
          <ManagerRoute>
            <CreateTemplatePage />
          </ManagerRoute>,
        ),
      },
      {
        path: '/templates/:templateId/edit',
        element: withSuspense(
          <ManagerRoute>
            <EditTemplatePage />
          </ManagerRoute>,
        ),
      },
      { path: '/messages', element: withSuspense(<MessagesPage />) },
      { path: '/integrations', element: withSuspense(<IntegrationsPage />) },
      { path: '/profile', element: withSuspense(<ProfilePage />) },
      {
        path: '/whatsapp',
        element: withSuspense(
          <AdminRoute>
            <WhatsAppPage />
          </AdminRoute>,
        ),
      },
      {
        path: '/api-keys',
        element: withSuspense(
          <AdminRoute>
            <ApiKeysPage />
          </AdminRoute>,
        ),
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
];

export const router = shouldUseHashRouter()
  ? createHashRouter(routes)
  : createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
