import { useCallback, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { EmptyState } from '@/components/shared/EmptyState';

import { ListPageShell, TablePanel } from '@/components/shared/ListPageLayout';

import { PageActions } from '@/components/shared/PageActions';

import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';

import { TableSkeleton } from '@/components/shared/TableSkeleton';

import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';

import { DEV_MOCK_API_KEYS } from '@/config/dev-mock-data';

import { useAuth } from '@/features/auth/context/AuthProvider';

import { listApiKeys } from '@/features/api-keys/api/listApiKeys';

import { ApiKeysTable } from '@/features/api-keys/components/ApiKeysTable';

import { ApiKeySecretDialog } from '@/features/api-keys/components/ApiKeySecretDialog';

import { CreateApiKeyDialog } from '@/features/api-keys/components/CreateApiKeyDialog';

import { RevokeApiKeyDialog } from '@/features/api-keys/components/RevokeApiKeyDialog';

import { apiKeyKeys } from '@/features/api-keys/queryKeys';

import type { CreateApiKeyResponse } from '@/features/api-keys/types';

import { canManageApiKeys } from '@/lib/permissions';



export function ApiKeysPage() {

  const useMockData = isDevMockAuthEnabled();

  const { user } = useAuth();

  const canManage = canManageApiKeys(user);

  const [createOpen, setCreateOpen] = useState(false);

  const [createdResult, setCreatedResult] = useState<CreateApiKeyResponse | null>(null);

  const [revokingId, setRevokingId] = useState<string | null>(null);



  const keysQuery = useQuery({

    queryKey: apiKeyKeys.list(),

    queryFn: listApiKeys,

    enabled: !useMockData,

  });



  const keysData = useMockData ? DEV_MOCK_API_KEYS : keysQuery.data;

  const revokingKey = keysData?.find((key) => key.id === revokingId);



  const handleCreated = useCallback((result: CreateApiKeyResponse) => {

    setCreatedResult(result);

  }, []);



  return (

    <ListPageShell>

      {canManage ? (

        <PageActions>

          <Button onClick={() => setCreateOpen(true)}>

            <Plus className="mr-2 h-4 w-4" />

            Create API key

          </Button>

        </PageActions>

      ) : null}



      {!useMockData && keysQuery.isLoading ? (

        <TableSkeleton columns={6} />

      ) : !useMockData && keysQuery.isError ? (

        <QueryErrorPanel error={keysQuery.error} onRetry={() => void keysQuery.refetch()} />

      ) : keysData && keysData.length > 0 ? (

        <TablePanel>

          <ApiKeysTable items={keysData} canManage={canManage} onRevoke={setRevokingId} />

        </TablePanel>

      ) : (

        <EmptyState

          title="No API keys yet"

          description="Create an API key for your integrator to send events via the API."

          action={

            canManage ? (

              <Button onClick={() => setCreateOpen(true)}>

                <Plus className="mr-2 h-4 w-4" />

                Create API key

              </Button>

            ) : undefined

          }

        />

      )}



      {canManage && createOpen ? (

        <CreateApiKeyDialog

          open={createOpen}

          onOpenChange={setCreateOpen}

          onCreated={handleCreated}

        />

      ) : null}



      <ApiKeySecretDialog result={createdResult} onClose={() => setCreatedResult(null)} />



      <RevokeApiKeyDialog

        apiKeyId={revokingId}

        apiKeyName={revokingKey?.name}

        onClose={() => setRevokingId(null)}

      />

    </ListPageShell>

  );

}


