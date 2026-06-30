export type WhatsAppAccountStatus = 'ACTIVE' | 'ERROR' | 'DISCONNECTED';

export type WhatsAppAccountDto = {
  id: string;
  organizationId: string;
  metaWabaId: string;
  name: string | null;
  status: WhatsAppAccountStatus;
  lastSyncedAt: string | null;
  lastError: string | null;
  phoneNumberCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PhoneNumberStatus = 'ACTIVE' | 'PENDING' | 'RESTRICTED' | 'INACTIVE';
export type PhoneQualityRating = 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';

export type PhoneNumberDto = {
  id: string;
  whatsAppAccountId: string;
  metaPhoneNumberId: string;
  displayNumber: string;
  verifiedName: string | null;
  qualityRating: PhoneQualityRating;
  messagingTier: string | null;
  status: PhoneNumberStatus;
  isDefault: boolean;
  lastHealthCheckAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConnectWhatsAppAccountRequest = {
  metaWabaId: string;
  name?: string;
  accessToken: string;
  appSecret: string;
  webhookVerifyToken?: string;
  syncPhones?: boolean;
};

export type ConnectWhatsAppAccountResponse = {
  account: WhatsAppAccountDto;
  phoneNumbers: PhoneNumberDto[];
};

export type SyncAccountResponse = {
  account: WhatsAppAccountDto;
  phoneNumbers: PhoneNumberDto[];
};

export type SetDefaultPhoneResponse = {
  phoneNumber: PhoneNumberDto;
};
