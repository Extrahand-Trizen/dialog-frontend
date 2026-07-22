import type { AuthUser } from '@/features/auth/types';
import { isAdmin } from '@/features/auth/types';

export function canManageWhatsApp(user: AuthUser | undefined): boolean {
  return isAdmin(user);
}

export function canSyncTemplates(user: AuthUser | undefined): boolean {
  return isAdmin(user);
}

export function canManageApiKeys(user: AuthUser | undefined): boolean {
  return isAdmin(user);
}

export function canManageNotificationRules(user: AuthUser | undefined): boolean {
  return isAdmin(user);
}

export function canSendMessages(user: AuthUser | undefined): boolean {
  return isAdmin(user);
}

export function canViewAdminNav(user: AuthUser | undefined): boolean {
  return isAdmin(user);
}
