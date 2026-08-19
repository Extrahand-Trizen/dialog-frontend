import { platformGet, platformGetPaginated, platformPatch, platformPost } from '@/lib/platform-api-client';
import type {
  CreateOrganizationInput,
  CreateOrganizationResult,
  OrganizationDetail,
  OrganizationSummary,
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
