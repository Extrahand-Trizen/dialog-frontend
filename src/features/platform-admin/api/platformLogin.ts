import { platformPost } from '@/lib/platform-api-client';
import type { PlatformLoginInput, PlatformLoginResult } from '@/features/platform-admin/types';

export async function platformLogin(input: PlatformLoginInput): Promise<PlatformLoginResult> {
  return platformPost<PlatformLoginResult, PlatformLoginInput>('/platform/auth/login', input);
}
