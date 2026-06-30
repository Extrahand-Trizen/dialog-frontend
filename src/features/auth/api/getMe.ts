import { get } from '@/lib/api-client';
import type { AuthUser } from '@/features/auth/types';

type GetMeResponse = {
  user: AuthUser;
};

export async function getMe(): Promise<AuthUser> {
  const data = await get<GetMeResponse>('/auth/me');
  return data.user;
}
