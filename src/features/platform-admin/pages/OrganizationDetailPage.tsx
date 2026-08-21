import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListPageShell, TablePanel } from '@/components/shared/ListPageLayout';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import {
  getOrganization,
  listOrganizationWhatsAppAccounts,
} from '@/features/platform-admin/api/organizations';
import { EditOrganizationDialog } from '@/features/platform-admin/components/EditOrganizationDialog';
import { DeleteWhatsAppAccountDialog } from '@/features/platform-admin/components/DeleteWhatsAppAccountDialog';
import { EditWhatsAppAccountNameDialog } from '@/features/platform-admin/components/EditWhatsAppAccountNameDialog';
import { WhatsAppAccountsTable } from '@/features/platform-admin/components/WhatsAppAccountsTable';
import {
  PlatformBackLink,
  PlatformInitials,
  PlatformSectionHeader,
  PlatformStat,
  PlatformStatusPill,
} from '@/features/platform-admin/components/platform-ui';
import { platformOrganizationKeys } from '@/features/platform-admin/queryKeys';
import type { PlatformWhatsAppAccount } from '@/features/platform-admin/types';
import { formatDate } from '@/lib/format';

export function OrganizationDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PlatformWhatsAppAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<PlatformWhatsAppAccount | null>(null);

  const orgQuery = useQuery({
    queryKey: platformOrganizationKeys.detail(id),
    queryFn: () => getOrganization(id),
    enabled: Boolean(id),
  });

  const accountsQuery = useQuery({
    queryKey: platformOrganizationKeys.whatsAppAccounts(id),
    queryFn: () => listOrganizationWhatsAppAccounts(id),
    enabled: Boolean(id),
  });

  if (orgQuery.isLoading) {
    return (
      <ListPageShell>
        <TableSkeleton columns={4} rows={3} />
      </ListPageShell>
    );
  }

  if (orgQuery.isError || !orgQuery.data) {
    return (
      <ListPageShell>
        <QueryErrorPanel
          error={orgQuery.error ?? new Error('Organization not found')}
          onRetry={() => void orgQuery.refetch()}
        />
      </ListPageShell>
    );
  }

  const organization = orgQuery.data;
  const accountCount = accountsQuery.data?.length;

  return (
    <ListPageShell className="space-y-8">
      <div className="space-y-5">
        <PlatformBackLink to="/platform">All clients</PlatformBackLink>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <PlatformInitials name={organization.name} className="h-11 w-11 text-sm" />
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-semibold tracking-tight">
                  {organization.name}
                </h1>
                <PlatformStatusPill active={organization.isActive} />
              </div>
              <p className="font-mono text-sm text-muted-foreground">{organization.slug}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-9" onClick={() => setEditingDetails(true)}>
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit details
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border/80 bg-background/70 px-5 py-4 sm:grid-cols-4">
          <PlatformStat label="Members" value={organization.counts.members} />
          <PlatformStat label="WhatsApp" value={organization.counts.whatsAppAccounts} />
          <PlatformStat label="Templates" value={organization.counts.templates} />
          <PlatformStat label="Created" value={formatDate(organization.createdAt)} />
        </div>
      </div>

      <Separator className="bg-border/70" />

      <div className="space-y-4">
        <PlatformSectionHeader
          title="WhatsApp accounts"
          description={
            accountCount === undefined
              ? 'Loading connected accounts…'
              : accountCount === 0
                ? 'No connected accounts yet'
                : `${accountCount} account${accountCount === 1 ? '' : 's'} connected`
          }
        />

        {accountsQuery.isLoading ? (
          <TableSkeleton columns={4} />
        ) : accountsQuery.isError ? (
          <QueryErrorPanel
            error={accountsQuery.error}
            onRetry={() => void accountsQuery.refetch()}
          />
        ) : accountsQuery.data && accountsQuery.data.length > 0 ? (
          <TablePanel className="border-border/80 shadow-none">
            <WhatsAppAccountsTable
              organizationId={id}
              items={accountsQuery.data}
              onEditName={setEditingAccount}
              onDelete={setDeletingAccount}
            />
          </TablePanel>
        ) : (
          <EmptyState
            title="No WhatsApp accounts"
            description="This client has not connected a WhatsApp Business account yet."
          />
        )}
      </div>

      <EditOrganizationDialog
        organization={organization}
        open={editingDetails}
        onOpenChange={setEditingDetails}
      />

      <EditWhatsAppAccountNameDialog
        organizationId={id}
        account={editingAccount}
        open={Boolean(editingAccount)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingAccount(null);
          }
        }}
      />

      <DeleteWhatsAppAccountDialog
        organizationId={id}
        account={deletingAccount}
        open={Boolean(deletingAccount)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingAccount(null);
          }
        }}
      />
    </ListPageShell>
  );
}
