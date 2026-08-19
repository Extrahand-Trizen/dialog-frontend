import { platformGet } from '@/lib/platform-api-client';
import type { PlatformAdminUser } from '@/features/platform-admin/types';

type GetPlatformMeResponse = {
  admin: PlatformAdminUser;
};

export async function getPlatformMe(): Promise<PlatformAdminUser> {
  const data = await platformGet<GetPlatformMeResponse>('/platform/auth/me');
  return data.admin;
}
