export type UserRole = 'ADMIN' | 'VIEWER';

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  organizationSlug: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
  user: AuthUser;
};

export function isAdmin(user: AuthUser | null | undefined): boolean {
  return user?.role === 'ADMIN';
}

export function getUserDisplayName(user: AuthUser): string {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  return name || user.email;
}

export function getUserInitials(user: AuthUser): string {
  const first = user.firstName?.trim().charAt(0) ?? user.email?.charAt(0) ?? '?';
  const last = user.lastName?.trim().charAt(0) ?? '';
  return `${first}${last}`.toUpperCase();
}
