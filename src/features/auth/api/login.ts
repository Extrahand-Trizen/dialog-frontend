import { post } from '@/lib/api-client';
import type { LoginInput, LoginResult } from '@/features/auth/types';

export async function login(input: LoginInput): Promise<LoginResult> {
  return post<LoginResult, LoginInput>('/auth/login', input);
}
