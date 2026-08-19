import type { AuthUser } from '@/features/auth/types';
import { canWriteMessages, isAdmin, isManagerOrAdmin } from '@/features/auth/types';

// WhatsApp connection, API keys, and outbound webhooks are foundational
// account setup — Admin only, same as before.
export function canManageWhatsApp(user: AuthUser | undefined): boolean {
  return isAdmin(user);
}

export function canManageApiKeys(user: AuthUser | undefined): boolean {
  return isAdmin(user);
}

// Templates and notification rules are day-to-day operational work —
// Manager owns these alongside Admin.
export function canSyncTemplates(user: AuthUser | undefined): boolean {
  return isManagerOrAdmin(user);
}

export function canManageNotificationRules(user: AuthUser | undefined): boolean {
  return isManagerOrAdmin(user);
}

// Sending messages is Agent's core job, so Admin/Manager/Agent all qualify.
export function canSendMessages(user: AuthUser | undefined): boolean {
  return canWriteMessages(user);
}

export function canViewAdminNav(user: AuthUser | undefined): boolean {
  return isAdmin(user);
}
