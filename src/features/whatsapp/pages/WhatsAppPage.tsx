import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Skeleton } from '@/components/ui/skeleton';

import { EmptyState } from '@/components/shared/EmptyState';

import { ListPageShell } from '@/components/shared/ListPageLayout';

import { PageActions } from '@/components/shared/PageActions';

import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';

import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';

import { DEV_MOCK_WHATSAPP_ACCOUNTS } from '@/config/dev-mock-data';

import { useAuth } from '@/features/auth/context/AuthProvider';

import { listAccounts } from '@/features/whatsapp/api/listAccounts';

import { ConnectAccountDialog } from '@/features/whatsapp/components/ConnectAccountDialog';

import { PhoneNumbersPanel } from '@/features/whatsapp/components/PhoneNumbersPanel';

import { whatsappKeys } from '@/features/whatsapp/queryKeys';

import { canManageWhatsApp } from '@/lib/permissions';



export function WhatsAppPage() {

  const useMockData = isDevMockAuthEnabled();

  const { user } = useAuth();

  const [connectOpen, setConnectOpen] = useState(false);

  const canManage = canManageWhatsApp(user);



  const accountsQuery = useQuery({

    queryKey: whatsappKeys.accounts(),

    queryFn: listAccounts,

    enabled: !useMockData,

  });



  const accountsData = useMockData ? DEV_MOCK_WHATSAPP_ACCOUNTS : accountsQuery.data;



  return (

    <ListPageShell>

      {canManage ? (

        <PageActions>

          <Button onClick={() => setConnectOpen(true)}>

            <Plus className="mr-2 h-4 w-4" />

            Connect account

          </Button>

        </PageActions>

      ) : null}



      {!useMockData && accountsQuery.isLoading ? (

        <div className="space-y-4">

          <Skeleton className="h-40 rounded-xl" />

          <Skeleton className="h-40 rounded-xl" />

        </div>

      ) : !useMockData && accountsQuery.isError ? (

        <QueryErrorPanel

          error={accountsQuery.error}

          onRetry={() => void accountsQuery.refetch()}

        />

      ) : accountsData && accountsData.length > 0 ? (

        <div className="space-y-4">

          {accountsData.map((account) => (

            <PhoneNumbersPanel key={account.id} account={account} />

          ))}

        </div>

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


