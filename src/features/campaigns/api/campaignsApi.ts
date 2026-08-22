import { get, getPaginated, patch, post } from '@/lib/api-client';
import { toApiQueryParams } from '@/lib/query-params';
import type { Campaign, CampaignRecipient } from '../types';

export async function listCampaigns(req: { page?: number; limit?: number; search?: string }) {
  return getPaginated<Campaign>(
    '/campaigns',
    toApiQueryParams(req as Record<string, string | number | undefined>),
  );
}

export async function getCampaign(campaignId: string): Promise<Campaign> {
  return get<Campaign>(`/campaigns/${campaignId}`);
}

export async function createCampaign(body: {
  name?: string;
  templateName: string;
  language: string;
  phoneNumberId?: string;
  variables?: Record<string, string>;
  recipients: string[];
}): Promise<Campaign> {
  return post<Campaign, typeof body>('/campaigns', body);
}

export async function updateCampaignRecipient(
  campaignId: string,
  body: CampaignRecipient,
): Promise<Campaign> {
  return patch<Campaign, CampaignRecipient>(`/campaigns/${campaignId}/recipients`, body);
}
