import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { FilterPanel, ListPageShell, TablePanel } from '@/components/shared/ListPageLayout';
import { PageActions } from '@/components/shared/PageActions';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TablePagination } from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTableParams } from '@/hooks/use-table-params';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import {
  filterDevMockNotificationRules,
  getDevMockNotificationRule,
} from '@/config/dev-mock-data';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { getNotificationRule } from '@/features/notification-rules/api/getNotificationRule';
import { listNotificationRules } from '@/features/notification-rules/api/listNotificationRules';
import { DeleteRuleDialog } from '@/features/notification-rules/components/DeleteRuleDialog';
import { NotificationRulesFilters } from '@/features/notification-rules/components/NotificationRulesFilters';
import { NotificationRulesTable } from '@/features/notification-rules/components/NotificationRulesTable';
import { RuleFormDialog } from '@/features/notification-rules/components/RuleFormDialog';
import { notificationRuleKeys } from '@/features/notification-rules/queryKeys';
import { canManageNotificationRules } from '@/lib/permissions';

const RULE_FILTER_DEFAULTS = {
  enabled: undefined as 'true' | 'false' | undefined,
  eventKey: undefined as string | undefined,
};

export function NotificationRulesPage() {
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const canManage = canManageNotificationRules(user);
  const { params, setParams, resetPage } = useTableParams(RULE_FILTER_DEFAULTS);
  const [eventKeyInput, setEventKeyInput] = useState(params.eventKey ?? '');
  const debouncedEventKey = useDebouncedValue(eventKeyInput);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    resetPage();
    setParams({ eventKey: debouncedEventKey || undefined });
  }, [debouncedEventKey, resetPage, setParams]);

  const queryParams = useMemo(
    () => ({
      page: params.page,
      limit: params.limit,
      enabled: params.enabled,
      eventKey: params.eventKey,
    }),
    [params],
  );

  const rulesQuery = useQuery({
    queryKey: notificationRuleKeys.list(queryParams),
    queryFn: () => listNotificationRules(queryParams),
    enabled: !useMockData,
    placeholderData: (prev) => prev,
  });

  const editRuleQuery = useQuery({
    queryKey: notificationRuleKeys.detail(editingId ?? ''),
    queryFn: () => getNotificationRule({ ruleId: editingId! }),
    enabled: !useMockData && !!editingId && formOpen,
  });

  const listData = useMockData
    ? filterDevMockNotificationRules(queryParams)
    : rulesQuery.data;
  const editRuleData = useMockData
    ? editingId
      ? getDevMockNotificationRule(editingId)
      : undefined
    : editRuleQuery.data;

  const deletingRule = listData?.items.find((rule) => rule.id === deletingId);

  const handleEdit = useCallback((ruleId: string) => {
    setEditingId(ruleId);
    setFormOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingId(null);
    setFormOpen(true);
  }, []);

  const handleFormOpenChange = useCallback((open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingId(null);
  }, []);

  return (
    <ListPageShell>
      {canManage ? (
        <PageActions>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create rule
          </Button>
        </PageActions>
      ) : null}

      <FilterPanel>
        <NotificationRulesFilters
          eventKey={eventKeyInput}
          enabled={params.enabled}
          onEventKeyChange={setEventKeyInput}
          onEnabledChange={(enabled) => {
            resetPage();
            setParams({ enabled });
          }}
        />
      </FilterPanel>

      {!useMockData && rulesQuery.isLoading ? (
        <TableSkeleton columns={6} />
      ) : !useMockData && rulesQuery.isError ? (
        <QueryErrorPanel
          error={rulesQuery.error}
          onRetry={() => void rulesQuery.refetch()}
        />
      ) : listData && listData.items.length > 0 ? (
        <>
          <TablePanel>
            <NotificationRulesTable
              items={listData.items}
              canManage={canManage}
              onEdit={handleEdit}
              onDelete={setDeletingId}
            />
          </TablePanel>
          <TablePagination
            page={listData.meta.page}
            totalPages={listData.meta.totalPages}
            total={listData.meta.total}
            onPageChange={(page) => setParams({ page })}
          />
        </>
      ) : (
        <EmptyState
          title="No notification rules yet"
          description="Create a rule to send WhatsApp messages when matching events are ingested."
          action={
            canManage ? (
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create rule
              </Button>
            ) : undefined
          }
        />
      )}

      {formOpen ? (
        <RuleFormDialog
          open={formOpen}
          onOpenChange={handleFormOpenChange}
          rule={editingId ? editRuleData : undefined}
        />
      ) : null}

      <DeleteRuleDialog
        ruleId={deletingId}
        ruleName={deletingRule?.name}
        onClose={() => setDeletingId(null)}
      />
    </ListPageShell>
  );
}
