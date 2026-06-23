import { get } from '@/lib/api-client';
import type { PhoneNumberDto } from '@/features/whatsapp/types';

export type ListPhoneNumbersRequest = {
  accountId: string;
};

export async function listPhoneNumbers(
  req: ListPhoneNumbersRequest,
): Promise<PhoneNumberDto[]> {
  return get<PhoneNumberDto[]>(`/whatsapp/accounts/${req.accountId}/phone-numbers`);
}
