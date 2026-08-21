import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListPageShell, TablePanel } from '@/components/shared/ListPageLayout';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TablePagination } from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTableParams } from '@/hooks/use-table-params';
import { listOrganizations } from '@/features/platform-admin/api/organizations';
import { CreateOrganizationDialog } from '@/features/platform-admin/components/CreateOrganizationDialog';
import { OrganizationsTable } from '@/features/platform-admin/components/OrganizationsTable';
import { PlatformPageHeader } from '@/features/platform-admin/components/PlatformPageHeader';
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

  const total = orgsQuery.data?.meta.total;

  return (
    <ListPageShell className="space-y-6">
      <PlatformPageHeader
        title="Clients"
        description={
          total === undefined
            ? 'Organizations, WhatsApp accounts, and templates across the platform.'
            : `${total} client${total === 1 ? '' : 's'} on the platform`
        }
        actions={
          <Button onClick={() => setCreateOpen(true)} className="h-9">
            <Plus className="mr-2 h-4 w-4" />
            Add client
          </Button>
        }
        toolbar={
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients…"
              className="h-9 border-border/80 bg-background/70 pl-9 shadow-none"
              value={searchInput}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>
        }
      />

      {orgsQuery.isLoading ? (
        <TableSkeleton columns={6} />
      ) : orgsQuery.isError ? (
        <QueryErrorPanel error={orgsQuery.error} onRetry={() => void orgsQuery.refetch()} />
      ) : orgsQuery.data && orgsQuery.data.items.length > 0 ? (
        <div className="space-y-4">
          <TablePanel className="border-border/80 shadow-none">
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
        </div>
      ) : (
        <EmptyState
          title="No clients yet"
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
