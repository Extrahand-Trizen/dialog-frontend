import type { AuthUser } from '@/features/auth/types';

/** Mock admin user for local UI development — never used in production builds. */
export const DEV_MOCK_USER: AuthUser = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'dev@trizendialog.local',
  firstName: 'Dev',
  lastName: 'Admin',
  role: 'ADMIN',
  organizationId: '00000000-0000-4000-8000-000000000002',
  organizationSlug: 'dev-org',
};

/**
 * Bypass login and use a mock admin session. Only active when:
 * - `npm run dev` (import.meta.env.DEV)
 * - `VITE_DEV_MOCK_AUTH=true` in `.env`
 *
 * API calls still hit the backend if configured unless dev mock data is used on list screens.
 */
export function isDevMockAuthEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_DEV_MOCK_AUTH === 'true';
}
