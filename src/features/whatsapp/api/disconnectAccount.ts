import { del } from '@/lib/api-client';

export type DisconnectAccountRequest = {
  accountId: string;
};

export async function disconnectAccount(req: DisconnectAccountRequest): Promise<null> {
  return del(`/whatsapp/accounts/${req.accountId}`);
}
