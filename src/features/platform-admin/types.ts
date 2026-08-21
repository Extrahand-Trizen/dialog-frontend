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

export type PlatformWhatsAppAccountStatus = 'ACTIVE' | 'ERROR' | 'DISCONNECTED';

export type PlatformWhatsAppAccount = {
  id: string;
  organizationId: string;
  metaWabaId: string;
  name: string | null;
  status: PlatformWhatsAppAccountStatus;
  lastSyncedAt: string | null;
  lastError: string | null;
  phoneNumberCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PlatformPhoneNumberStatus = 'ACTIVE' | 'PENDING' | 'RESTRICTED' | 'INACTIVE';
export type PlatformPhoneQualityRating = 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';

export type PlatformPhoneNumber = {
  id: string;
  whatsAppAccountId: string;
  metaPhoneNumberId: string;
  displayNumber: string;
  verifiedName: string | null;
  qualityRating: PlatformPhoneQualityRating;
  messagingTier: string | null;
  status: PlatformPhoneNumberStatus;
  isDefault: boolean;
  lastHealthCheckAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PlatformWhatsAppAccountDetail = {
  account: PlatformWhatsAppAccount;
  phoneNumbers: PlatformPhoneNumber[];
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
