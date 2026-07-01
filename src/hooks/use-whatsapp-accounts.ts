import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import {
  DEV_MOCK_WHATSAPP_ACCOUNTS,
  DEV_MOCK_WHATSAPP_ACCOUNT_ID,
} from '@/config/dev-mock-data';
import { listAccounts } from '@/features/whatsapp/api/listAccounts';
import { whatsappKeys } from '@/features/whatsapp/queryKeys';
import type { WhatsAppAccountDto } from '@/features/whatsapp/types';

type UseWhatsAppAccountsResult = {
  accounts: WhatsAppAccountDto[] | undefined;
  connectedAccounts: WhatsAppAccountDto[];
  defaultAccountId: string | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

export function isConnectedWhatsAppAccount(account: WhatsAppAccountDto): boolean {
  return account.status !== 'DISCONNECTED';
}

/** Cross-feature read access to WhatsApp accounts — avoids deep feature imports. */
export function useWhatsAppAccounts(): UseWhatsAppAccountsResult {
  const useMockData = isDevMockAuthEnabled();

  const query = useQuery({
    queryKey: whatsappKeys.accounts(),
    queryFn: listAccounts,
    enabled: !useMockData,
  });

  const accounts = useMockData ? DEV_MOCK_WHATSAPP_ACCOUNTS : query.data;

  const connectedAccounts = useMemo(
    () => (accounts ?? []).filter(isConnectedWhatsAppAccount),
    [accounts],
  );

  return {
    accounts,
    connectedAccounts,
    defaultAccountId:
      connectedAccounts[0]?.id ?? (useMockData ? DEV_MOCK_WHATSAPP_ACCOUNT_ID : undefined),
    isLoading: !useMockData && query.isLoading,
    isError: !useMockData && query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}

export function formatWhatsAppAccountLabel(account: WhatsAppAccountDto): string {
  return account.name ?? `WABA ${account.metaWabaId}`;
}
