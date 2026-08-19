import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/EmptyState';
import { FilterPanel, ListPageShell, TablePanel } from '@/components/shared/ListPageLayout';
import { PageActions } from '@/components/shared/PageActions';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TablePagination } from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTableParams } from '@/hooks/use-table-params';
import { listOrganizations } from '@/features/platform-admin/api/organizations';
import { CreateOrganizationDialog } from '@/features/platform-admin/components/CreateOrganizationDialog';
import { OrganizationsTable } from '@/features/platform-admin/components/OrganizationsTable';
import { useUpdateOrganizationStatus } from '@/features/platform-admin/hooks/useUpdateOrganizationStatus';
import { platformOrganizationKeys } from '@/features/platform-admin/queryKeys';
import type { OrganizationSummary } from '@/features/platform-admin/types';

export function OrganizationsPage() {
  const { params, setParams } = useTableParams({ search: undefined as string | undefined });
  const [searchInput, setSearchInput] = useState(params.search ?? '');
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [createOpen, setCreateOpen] = useState(false);
  const toggleStatus = useUpdateOrganizationStatus();

  const queryParams = {
    page: params.page,
    limit: params.limit,
    search: debouncedSearch || undefined,
  };

  const orgsQuery = useQuery({
    queryKey: platformOrganizationKeys.list(queryParams),
    queryFn: () => listOrganizations(queryParams),
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setParams({ search: value || undefined, page: 1 });
  };

  const handleToggleStatus = (organization: OrganizationSummary) => {
    void toggleStatus.mutateAsync({ id: organization.id, isActive: !organization.isActive });
  };

  return (
    <ListPageShell>
      <PageActions>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add client
        </Button>
      </PageActions>

      <FilterPanel>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or slug..."
            className="pl-9"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </div>
      </FilterPanel>

      {orgsQuery.isLoading ? (
        <TableSkeleton columns={8} />
      ) : orgsQuery.isError ? (
        <QueryErrorPanel error={orgsQuery.error} onRetry={() => void orgsQuery.refetch()} />
      ) : orgsQuery.data && orgsQuery.data.items.length > 0 ? (
        <>
          <TablePanel>
            <OrganizationsTable
              items={orgsQuery.data.items}
              onToggleStatus={handleToggleStatus}
              togglingId={toggleStatus.isPending ? toggleStatus.variables?.id : undefined}
            />
          </TablePanel>
          <TablePagination
            page={orgsQuery.data.meta.page}
            totalPages={orgsQuery.data.meta.totalPages}
            total={orgsQuery.data.meta.total}
            onPageChange={(page) => setParams({ page })}
          />
        </>
      ) : (
        <EmptyState
          title="No client organizations yet"
          description="Add your first client to create their organization and admin account."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add client
            </Button>
          }
        />
      )}

      <CreateOrganizationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {}}
      />
    </ListPageShell>
  );
}
