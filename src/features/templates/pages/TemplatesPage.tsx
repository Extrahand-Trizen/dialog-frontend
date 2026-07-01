import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListPageShell } from '@/components/shared/ListPageLayout';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TablePagination } from '@/components/shared/TablePagination';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTableParams } from '@/hooks/use-table-params';
import { useWhatsAppAccounts } from '@/hooks/use-whatsapp-accounts';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import {
  DEV_MOCK_WHATSAPP_ACCOUNT_ID,
  filterDevMockTemplates,
  getDevMockTemplateDetail,
} from '@/config/dev-mock-data';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { getTemplate } from '@/features/templates/api/getTemplate';
import { listTemplates } from '@/features/templates/api/listTemplates';
import { TemplateCreateWizardDialog } from '@/features/templates/components/TemplateCreateWizardDialog';
import { TemplateDetailDialog } from '@/features/templates/components/TemplateDetailDialog';
import { TemplatesCardGrid } from '@/features/templates/components/TemplatesCardGrid';
import { TemplatesCardGridSkeleton } from '@/features/templates/components/TemplatesCardGridSkeleton';
import { TemplatesPageControls } from '@/features/templates/components/TemplatesPageControls';
import { useSyncAllTemplates } from '@/features/templates/hooks/useSyncAllTemplates';
import { templateKeys } from '@/features/templates/queryKeys';
import type { TemplateCreateWizardValues } from '@/features/templates/schemas';
import type { MetaTemplateStatus, TemplateCategory } from '@/features/templates/types';
import { canSyncTemplates } from '@/lib/permissions';

const TEMPLATE_FILTER_DEFAULTS = {
  metaStatus: undefined as MetaTemplateStatus | undefined,
  category: undefined as TemplateCategory | undefined,
  search: undefined as string | undefined,
};

export function TemplatesPage() {
  const navigate = useNavigate();
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const { params, setParams, resetPage } = useTableParams(TEMPLATE_FILTER_DEFAULTS);
  const [searchInput, setSearchInput] = useState(params.search ?? '');
  const debouncedSearch = useDebouncedValue(searchInput);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const syncAllMutation = useSyncAllTemplates();
  const { connectedAccounts, defaultAccountId } = useWhatsAppAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();

  useEffect(() => {
    resetPage();
    setParams({ search: debouncedSearch || undefined });
  }, [debouncedSearch, resetPage, setParams]);

  const connectedAccountIds = useMemo(
    () => connectedAccounts.map((account) => account.id),
    [connectedAccounts],
  );

  const activeAccountId =
    selectedAccountId ??
    defaultAccountId ??
    (useMockData ? DEV_MOCK_WHATSAPP_ACCOUNT_ID : undefined);

  useEffect(() => {
    if (!selectedAccountId && defaultAccountId) {
      setSelectedAccountId(defaultAccountId);
    }
  }, [defaultAccountId, selectedAccountId]);

  const queryParams = useMemo(
    () => ({
      page: params.page,
      limit: params.limit,
      metaStatus: params.metaStatus,
      category: params.category,
      search: params.search,
    }),
    [params],
  );

  const templatesQuery = useQuery({
    queryKey: templateKeys.list(queryParams),
    queryFn: () => listTemplates(queryParams),
    enabled: !useMockData,
    placeholderData: (prev) => prev,
  });

  const detailQuery = useQuery({
    queryKey: templateKeys.detail(selectedId ?? ''),
    queryFn: () => getTemplate({ templateId: selectedId! }),
    enabled: !useMockData && !!selectedId,
  });

  const listData = useMockData ? filterDevMockTemplates(queryParams) : templatesQuery.data;
  const detailData = useMockData
    ? selectedId
      ? getDevMockTemplateDetail(selectedId)
      : undefined
    : detailQuery.data;

  const canManage = canSyncTemplates(user);
  const hasConnectedAccounts = connectedAccountIds.length > 0;
  const showActions = canManage && hasConnectedAccounts;

  const handleSyncAll = () => {
    if (connectedAccountIds.length === 0) return;
    syncAllMutation.mutate(connectedAccountIds);
  };

  const handleWizardContinue = (values: TemplateCreateWizardValues) => {
    navigate('/templates/new', { state: { initialValues: values } });
  };

  return (
    <ListPageShell>
      {canManage ? (
        <TemplatesPageControls
          accounts={connectedAccounts}
          selectedAccountId={activeAccountId}
          onSelectedAccountIdChange={setSelectedAccountId}
          canManage={canManage}
          isSyncing={syncAllMutation.isPending}
          onSyncAll={handleSyncAll}
          onCreate={() => setWizardOpen(true)}
          search={searchInput}
          metaStatus={params.metaStatus}
          category={params.category}
          totalTemplates={listData?.meta.total}
          onSearchChange={setSearchInput}
          onMetaStatusChange={(metaStatus) => {
            resetPage();
            setParams({ metaStatus });
          }}
          onCategoryChange={(category) => {
            resetPage();
            setParams({ category });
          }}
        />
      ) : null}

      {!useMockData && templatesQuery.isLoading ? (
        <TemplatesCardGridSkeleton />
      ) : !useMockData && templatesQuery.isError ? (
        <QueryErrorPanel
          error={templatesQuery.error}
          onRetry={() => void templatesQuery.refetch()}
        />
      ) : listData && listData.items.length > 0 ? (
        <>
          <TemplatesCardGrid items={listData.items} onSelect={setSelectedId} />
          <TablePagination
            page={listData.meta.page}
            totalPages={listData.meta.totalPages}
            total={listData.meta.total}
            onPageChange={(page) => setParams({ page })}
          />
        </>
      ) : (
        <EmptyState
          title="No templates yet"
          description={
            hasConnectedAccounts
              ? 'Create a template here, or use Sync all to import existing templates from Meta. Approval status updates via webhook.'
              : 'Connect a WhatsApp account, then create or import templates.'
          }
          action={
            showActions ? (
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={syncAllMutation.isPending}
                  onClick={handleSyncAll}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync all
                </Button>
                <Button onClick={() => setWizardOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create template
                </Button>
              </div>
            ) : undefined
          }
        />
      )}

      {selectedId ? (
        <TemplateDetailDialog
          templateId={selectedId}
          data={detailData}
          isLoading={!useMockData && detailQuery.isLoading}
          isError={!useMockData && detailQuery.isError}
          error={detailQuery.error}
          canManageTemplates={Boolean(showActions)}
          onClose={() => setSelectedId(null)}
          onEdit={(id) => {
            setSelectedId(null);
            navigate(`/templates/${id}/edit`);
          }}
        />
      ) : null}

      <TemplateCreateWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onContinue={handleWizardContinue}
      />
    </ListPageShell>
  );
}
