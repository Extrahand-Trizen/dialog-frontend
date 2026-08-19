export type PlatformAdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type PlatformLoginInput = {
  email: string;
  password: string;
};

export type PlatformLoginResult = {
  token: string;
  admin: PlatformAdminUser;
};

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  counts: {
    members: number;
    whatsAppAccounts: number;
    templates: number;
  };
};

export type OrganizationDetail = OrganizationSummary & {
  hasActiveWhatsAppAccount: boolean;
  createdByName: string | null;
};

export type CreateOrganizationInput = {
  name: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPassword: string;
};

export type CreateOrganizationResult = {
  organization: OrganizationSummary;
  adminUser: PlatformAdminUser;
};

export function getPlatformAdminDisplayName(admin: PlatformAdminUser): string {
  const name = `${admin.firstName ?? ''} ${admin.lastName ?? ''}`.trim();
  return name || admin.email;
}
