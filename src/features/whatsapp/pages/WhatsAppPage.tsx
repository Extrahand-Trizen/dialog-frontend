import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListPageShell } from '@/components/shared/ListPageLayout';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import { DEV_MOCK_WHATSAPP_ACCOUNTS } from '@/config/dev-mock-data';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { listAccounts } from '@/features/whatsapp/api/listAccounts';
import { ConnectAccountDialog } from '@/features/whatsapp/components/ConnectAccountDialog';
import { WhatsAppAccountCard } from '@/features/whatsapp/components/WhatsAppAccountCard';
import { WhatsAppAccountsTable } from '@/features/whatsapp/components/WhatsAppAccountsTable';
import { WhatsAppSetupHeader } from '@/features/whatsapp/components/WhatsAppSetupHeader';
import { whatsappKeys } from '@/features/whatsapp/queryKeys';
import { canManageWhatsApp } from '@/lib/permissions';
import { cn } from '@/lib/utils';

type ViewMode = 'cards' | 'table';

export function WhatsAppPage() {
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const [connectOpen, setConnectOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const canManage = canManageWhatsApp(user);

  const accountsQuery = useQuery({
    queryKey: whatsappKeys.accounts(),
    queryFn: listAccounts,
    enabled: !useMockData,
  });

  const accountsData = useMockData ? DEV_MOCK_WHATSAPP_ACCOUNTS : accountsQuery.data;

  const totalPhones = useMemo(
    () => accountsData?.reduce((sum, account) => sum + account.phoneNumberCount, 0) ?? 0,
    [accountsData],
  );

  return (
    <ListPageShell>
      <WhatsAppSetupHeader
        accountCount={accountsData?.length ?? 0}
        phoneCount={totalPhones}
        canManage={canManage}
        onConnect={() => setConnectOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={Boolean(accountsData && accountsData.length > 0)}
      />

      {!useMockData && accountsQuery.isLoading ? (
        <div
          className={cn(
            viewMode === 'cards'
              ? 'grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3'
              : 'space-y-3',
          )}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className={viewMode === 'cards' ? 'h-48 rounded-2xl' : 'h-40 rounded-xl'}
            />
          ))}
        </div>
      ) : !useMockData && accountsQuery.isError ? (
        <QueryErrorPanel
          error={accountsQuery.error}
          onRetry={() => void accountsQuery.refetch()}
        />
      ) : accountsData && accountsData.length > 0 ? (
        viewMode === 'cards' ? (
          <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {accountsData.map((account) => (
              <WhatsAppAccountCard key={account.id} account={account} />
            ))}
            {canManage ? (
              <button
                type="button"
                onClick={() => setConnectOpen(true)}
                className="flex h-fit flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-muted-foreground transition hover:border-primary/40 hover:bg-primary/[0.04] hover:text-foreground"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-background">
                  <Plus className="size-5" />
                </span>
                <span className="text-sm font-medium">Connect account</span>
              </button>
            ) : null}
          </div>
        ) : (
          <WhatsAppAccountsTable accounts={accountsData} />
        )
      ) : (
        <EmptyState
          title="No WhatsApp accounts connected"
          description="Connect your Meta WhatsApp Business Account to sync phone numbers and templates."
          action={
            canManage ? (
              <Button onClick={() => setConnectOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Connect account
              </Button>
            ) : undefined
          }
        />
      )}

      {canManage && connectOpen ? (
        <ConnectAccountDialog open={connectOpen} onOpenChange={setConnectOpen} />
      ) : null}
    </ListPageShell>
  );
}
