import { post } from '@/lib/api-client';
import type { SyncAccountResponse } from '@/features/whatsapp/types';

export type SyncAccountRequest = {
  accountId: string;
};

export async function syncAccount(req: SyncAccountRequest): Promise<SyncAccountResponse> {
  return post<SyncAccountResponse>(`/whatsapp/accounts/${req.accountId}/sync`);
}
