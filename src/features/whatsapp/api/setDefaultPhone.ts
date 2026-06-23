import { post } from '@/lib/api-client';
import type { SetDefaultPhoneResponse } from '@/features/whatsapp/types';

export type SetDefaultPhoneRequest = {
  accountId: string;
  phoneId: string;
};

export async function setDefaultPhone(
  req: SetDefaultPhoneRequest,
): Promise<SetDefaultPhoneResponse> {
  return post<SetDefaultPhoneResponse>(
    `/whatsapp/accounts/${req.accountId}/phone-numbers/${req.phoneId}/default`,
  );
}
