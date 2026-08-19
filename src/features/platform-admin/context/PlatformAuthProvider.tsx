import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PLATFORM_AUTH_TOKEN_KEY } from '@/lib/platform-api-client';
import { platformLogin as platformLoginApi } from '@/features/platform-admin/api/platformLogin';
import { getPlatformMe } from '@/features/platform-admin/api/getPlatformMe';
import { platformAuthKeys } from '@/features/platform-admin/queryKeys';
import type { PlatformAdminUser, PlatformLoginInput } from '@/features/platform-admin/types';

type PlatformAuthContextValue = {
  admin: PlatformAdminUser | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: PlatformLoginInput) => Promise<void>;
  logout: () => void;
};

const PlatformAuthContext = createContext<PlatformAuthContextValue | null>(null);

function readToken(): string | null {
  return localStorage.getItem(PLATFORM_AUTH_TOKEN_KEY);
}

export function PlatformAuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(readToken);

  const meQuery = useQuery({
    queryKey: platformAuthKeys.me(),
    queryFn: getPlatformMe,
    enabled: !!token,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: platformLoginApi,
    onSuccess: (result) => {
      localStorage.setItem(PLATFORM_AUTH_TOKEN_KEY, result.token);
      setToken(result.token);
      queryClient.setQueryData(platformAuthKeys.me(), result.admin);
    },
  });

  const login = useCallback(
    async (input: PlatformLoginInput) => {
      await loginMutation.mutateAsync(input);
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(PLATFORM_AUTH_TOKEN_KEY);
    setToken(null);
    // Same reasoning as the org AuthProvider: clear everything so no
    // stale org-list/detail cache survives into the next platform-admin session.
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<PlatformAuthContextValue>(
    () => ({
      admin: meQuery.data,
      isAuthenticated: !!token && !!meQuery.data,
      isLoading: !!token && meQuery.isLoading,
      login,
      logout,
    }),
    [login, logout, meQuery.data, meQuery.isLoading, token],
  );

  return <PlatformAuthContext.Provider value={value}>{children}</PlatformAuthContext.Provider>;
}

export function usePlatformAuth(): PlatformAuthContextValue {
  const context = useContext(PlatformAuthContext);
  if (!context) {
    throw new Error('usePlatformAuth must be used within PlatformAuthProvider');
  }
  return context;
}
