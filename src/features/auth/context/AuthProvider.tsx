import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DEV_MOCK_USER, isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import { AUTH_TOKEN_KEY } from '@/lib/api-client';
import { login as loginApi } from '@/features/auth/api/login';
import { getMe } from '@/features/auth/api/getMe';
import { authKeys } from '@/features/auth/queryKeys';
import type { AuthUser, LoginInput } from '@/features/auth/types';

type AuthContextValue = {
  user: AuthUser | undefined;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isDevMockAuth: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const mockAuthEnabled = isDevMockAuthEnabled();

function readToken(): string | null {
  if (mockAuthEnabled) return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(readToken);

  const meQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    enabled: !mockAuthEnabled && !!token,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (result) => {
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      setToken(result.token);
      queryClient.setQueryData(authKeys.me(), result.user);
    },
  });

  const login = useCallback(
    async (input: LoginInput) => {
      if (mockAuthEnabled) return;
      await loginMutation.mutateAsync(input);
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    if (mockAuthEnabled) return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    queryClient.removeQueries({ queryKey: authKeys.all });
  }, [queryClient]);

  const user = mockAuthEnabled ? DEV_MOCK_USER : meQuery.data;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token: mockAuthEnabled ? null : token,
      isAuthenticated: mockAuthEnabled ? true : !!token && !!meQuery.data,
      isLoading: mockAuthEnabled ? false : !!token && meQuery.isLoading,
      isAdmin: user?.role === 'ADMIN',
      isDevMockAuth: mockAuthEnabled,
      login,
      logout,
    }),
    [login, logout, meQuery.data, meQuery.isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
