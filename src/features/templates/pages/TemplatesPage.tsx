import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { CopyTemplatesDialog } from '@/features/templates/components/CopyTemplatesDialog';
import { DeleteTemplatesDialog } from '@/features/templates/components/DeleteTemplatesDialog';
import { TemplateDetailDialog } from '@/features/templates/components/TemplateDetailDialog';
import { TemplatesCardGrid } from '@/features/templates/components/TemplatesCardGrid';
import { TemplatesCardGridSkeleton } from '@/features/templates/components/TemplatesCardGridSkeleton';
import { TemplatesPageControls } from '@/features/templates/components/TemplatesPageControls';
import { TemplatesSelectionBar } from '@/features/templates/components/TemplatesSelectionBar';
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
  const location = useLocation();
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const { params, setParams, resetPage } = useTableParams(TEMPLATE_FILTER_DEFAULTS);
  const [searchInput, setSearchInput] = useState(params.search ?? '');
  const debouncedSearch = useDebouncedValue(searchInput);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const syncAllMutation = useSyncAllTemplates();
  const { connectedAccounts, defaultAccountId, isLoading: accountsLoading } = useWhatsAppAccounts();
  const locationAccountId = (
    location.state as { whatsAppAccountId?: string } | null
  )?.whatsAppAccountId;
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(locationAccountId);
  const previousAccountIdRef = useRef<string | undefined>(undefined);

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
    if (selectedAccountId && connectedAccountIds.includes(selectedAccountId)) {
      return;
    }
    if (locationAccountId && connectedAccountIds.includes(locationAccountId)) {
      setSelectedAccountId(locationAccountId);
      return;
    }
    if (defaultAccountId) {
      setSelectedAccountId(defaultAccountId);
    }
  }, [connectedAccountIds, defaultAccountId, locationAccountId, selectedAccountId]);

  useEffect(() => {
    if (
      previousAccountIdRef.current &&
      activeAccountId &&
      previousAccountIdRef.current !== activeAccountId
    ) {
      resetPage();
      setIsSelecting(false);
      setSelectedTemplateIds(new Set());
    }
    previousAccountIdRef.current = activeAccountId;
  }, [activeAccountId, resetPage]);

  const queryParams = useMemo(
    () => ({
      page: params.page,
      limit: params.limit,
      metaStatus: params.metaStatus,
      category: params.category,
      search: params.search,
      whatsAppAccountId: activeAccountId,
    }),
    [params, activeAccountId],
  );

  const templatesQuery = useQuery({
    queryKey: templateKeys.list(queryParams),
    queryFn: () => listTemplates(queryParams),
    enabled: !useMockData && Boolean(activeAccountId),
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
  const sourceAccount = connectedAccounts.find((account) => account.id === activeAccountId);
  const targetAccounts = connectedAccounts.filter((account) => account.id !== activeAccountId);
  const canCopyToWaba = Boolean(showActions && targetAccounts.length > 0);
  const canSelectTemplates = Boolean(showActions);

  const toggleTemplateSelected = (templateId: string) => {
    setSelectedTemplateIds((current) => {
      const next = new Set(current);
      if (next.has(templateId)) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      return next;
    });
  };

  const toggleAllOnPage = (checked: boolean) => {
    const pageIds = listData?.items.map((item) => item.id) ?? [];
    setSelectedTemplateIds((current) => {
      const next = new Set(current);
      if (checked) {
        pageIds.forEach((id) => next.add(id));
      } else {
        pageIds.forEach((id) => next.delete(id));
      }
      return next;
    });
  };

  const exitSelectMode = () => {
    setIsSelecting(false);
    setSelectedTemplateIds(new Set());
  };

  const handleSyncAll = () => {
    if (connectedAccountIds.length === 0) return;
    syncAllMutation.mutate(connectedAccountIds);
  };

  const handleWizardContinue = (values: TemplateCreateWizardValues) => {
    navigate('/templates/new', {
      state: { initialValues: values, whatsAppAccountId: activeAccountId },
    });
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
          onCopyToWaba={() => setCopyOpen(true)}
          onEnterSelectMode={() => setIsSelecting(true)}
          onCopySelected={() => setCopyOpen(true)}
          onDeleteSelected={() => setPendingDeleteIds([...selectedTemplateIds])}
          canCopyToWaba={canCopyToWaba}
          canSelectTemplates={canSelectTemplates}
          isSelecting={isSelecting}
          selectedCount={selectedTemplateIds.size}
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

      {!useMockData && (accountsLoading || templatesQuery.isLoading) ? (
        <TemplatesCardGridSkeleton />
      ) : !useMockData && templatesQuery.isError ? (
        <QueryErrorPanel
          error={templatesQuery.error}
          onRetry={() => void templatesQuery.refetch()}
        />
      ) : listData && listData.items.length > 0 ? (
        <>
          {canSelectTemplates && isSelecting ? (
            <TemplatesSelectionBar
              pageItemIds={listData.items.map((item) => item.id)}
              selectedIds={selectedTemplateIds}
              onToggleAllOnPage={toggleAllOnPage}
              onCancel={exitSelectMode}
            />
          ) : null}
          <TemplatesCardGrid
            items={listData.items}
            onSelect={setSelectedId}
            selectable={canSelectTemplates && isSelecting}
            selectedIds={selectedTemplateIds}
            onToggleSelect={toggleTemplateSelected}
          />
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
              ? 'Create a template here, or use Sync all to import existing templates and refresh their approval status from Meta.'
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
          onDelete={(id) => {
            setSelectedId(null);
            setPendingDeleteIds([id]);
          }}
        />
      ) : null}

      <CopyTemplatesDialog
        open={copyOpen}
        onOpenChange={setCopyOpen}
        sourceAccount={sourceAccount}
        targetAccounts={targetAccounts}
        selectedTemplateIds={[...selectedTemplateIds]}
        onCopied={exitSelectMode}
      />

      <DeleteTemplatesDialog
        open={pendingDeleteIds.length > 0}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteIds([]);
        }}
        account={sourceAccount}
        templateIds={pendingDeleteIds}
        onDeleted={exitSelectMode}
      />

      <TemplateCreateWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onContinue={handleWizardContinue}
      />
    </ListPageShell>
  );
}
