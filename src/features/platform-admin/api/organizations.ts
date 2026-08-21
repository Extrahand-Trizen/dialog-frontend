import { platformDelete, platformGet, platformGetPaginated, platformPatch, platformPost } from '@/lib/platform-api-client';
import type {
  CreateOrganizationInput,
  CreateOrganizationResult,
  OrganizationDetail,
  OrganizationSummary,
  PlatformWhatsAppAccount,
  PlatformWhatsAppAccountDetail,
} from '@/features/platform-admin/types';

export async function listOrganizations(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<{ items: OrganizationSummary[]; meta: { page: number; limit: number; total: number; totalPages: number } }> {
  const result = await platformGetPaginated<OrganizationSummary>('/platform/organizations', params);
  return { items: result.items, meta: result.meta as never };
}

export async function createOrganization(
  input: CreateOrganizationInput,
): Promise<CreateOrganizationResult> {
  return platformPost<CreateOrganizationResult, CreateOrganizationInput>(
    '/platform/organizations',
    input,
  );
}

export async function getOrganization(id: string): Promise<OrganizationDetail> {
  const data = await platformGet<{ organization: OrganizationDetail }>(
    `/platform/organizations/${id}`,
  );
  return data.organization;
}

export async function updateOrganizationStatus(
  id: string,
  isActive: boolean,
): Promise<OrganizationSummary> {
  const data = await platformPatch<{ organization: OrganizationSummary }, { isActive: boolean }>(
    `/platform/organizations/${id}`,
    { isActive },
  );
  return data.organization;
}

export async function updateOrganizationName(
  id: string,
  name: string,
): Promise<OrganizationSummary> {
  const data = await platformPatch<{ organization: OrganizationSummary }, { name: string }>(
    `/platform/organizations/${id}`,
    { name },
  );
  return data.organization;
}

export async function listOrganizationWhatsAppAccounts(
  organizationId: string,
): Promise<PlatformWhatsAppAccount[]> {
  const data = await platformGet<{ accounts: PlatformWhatsAppAccount[] }>(
    `/platform/organizations/${organizationId}/whatsapp-accounts`,
  );
  return data.accounts;
}

export async function getOrganizationWhatsAppAccount(
  organizationId: string,
  accountId: string,
): Promise<PlatformWhatsAppAccountDetail> {
  return platformGet<PlatformWhatsAppAccountDetail>(
    `/platform/organizations/${organizationId}/whatsapp-accounts/${accountId}`,
  );
}

export async function updateWhatsAppAccountName(
  organizationId: string,
  accountId: string,
  name: string,
): Promise<PlatformWhatsAppAccount> {
  const data = await platformPatch<
    { account: PlatformWhatsAppAccount },
    { name: string }
  >(`/platform/organizations/${organizationId}/whatsapp-accounts/${accountId}`, { name });
  return data.account;
}

export type DeleteWhatsAppAccountResult = {
  outcome: 'deleted';
};

export async function deleteWhatsAppAccount(
  organizationId: string,
  accountId: string,
): Promise<DeleteWhatsAppAccountResult> {
  return platformDelete<DeleteWhatsAppAccountResult>(
    `/platform/organizations/${organizationId}/whatsapp-accounts/${accountId}`,
  );
}
