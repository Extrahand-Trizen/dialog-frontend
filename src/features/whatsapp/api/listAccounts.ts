import { get } from '@/lib/api-client';
import type { WhatsAppAccountDto } from '@/features/whatsapp/types';

export async function listAccounts(): Promise<WhatsAppAccountDto[]> {
  return get<WhatsAppAccountDto[]>('/whatsapp/accounts');
}
