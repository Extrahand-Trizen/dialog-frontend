export const API_KEY_SCOPES = ['events:write', 'messages:write', 'templates:read'] as const;

export type ApiKeyScope = (typeof API_KEY_SCOPES)[number];

export type ApiKeySummaryDto = {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export type CreateApiKeyRequest = {
  name: string;
  scopes: ApiKeyScope[];
  expiresAt?: string;
};

export type CreateApiKeyResponse = {
  apiKey: ApiKeySummaryDto;
  secret: string;
};
