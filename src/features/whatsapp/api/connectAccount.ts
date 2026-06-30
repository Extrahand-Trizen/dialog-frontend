import { post } from '@/lib/api-client';
import type {
  ConnectWhatsAppAccountRequest,
  ConnectWhatsAppAccountResponse,
} from '@/features/whatsapp/types';

export async function connectAccount(
  req: ConnectWhatsAppAccountRequest,
): Promise<ConnectWhatsAppAccountResponse> {
  return post<ConnectWhatsAppAccountResponse, ConnectWhatsAppAccountRequest>(
    '/whatsapp/accounts',
    req,
  );
}
