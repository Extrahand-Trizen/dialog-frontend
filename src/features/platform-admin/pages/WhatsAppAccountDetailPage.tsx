import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Phone, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListPageShell } from '@/components/shared/ListPageLayout';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import {
  getOrganization,
  getOrganizationWhatsAppAccount,
} from '@/features/platform-admin/api/organizations';
import { DeleteWhatsAppAccountDialog } from '@/features/platform-admin/components/DeleteWhatsAppAccountDialog';
import { EditWhatsAppAccountNameDialog } from '@/features/platform-admin/components/EditWhatsAppAccountNameDialog';
import {
  PlatformBackLink,
  PlatformInitials,
  PlatformSectionHeader,
  PlatformStat,
  PlatformStatusPill,
  getWhatsAppStatusLabel,
  getWhatsAppStatusTone,
} from '@/features/platform-admin/components/platform-ui';
import { platformOrganizationKeys } from '@/features/platform-admin/queryKeys';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export function WhatsAppAccountDetailPage() {
  const navigate = useNavigate();
  const { id: organizationId = '', accountId = '' } = useParams<{
    id: string;
    accountId: string;
  }>();
  const [editingName, setEditingName] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const orgQuery = useQuery({
    queryKey: platformOrganizationKeys.detail(organizationId),
    queryFn: () => getOrganization(organizationId),
    enabled: Boolean(organizationId),
  });

  const accountQuery = useQuery({
    queryKey: platformOrganizationKeys.whatsAppAccountDetail(organizationId, accountId),
    queryFn: () => getOrganizationWhatsAppAccount(organizationId, accountId),
    enabled: Boolean(organizationId && accountId),
  });

  if (accountQuery.isLoading) {
    return (
      <ListPageShell>
        <TableSkeleton columns={3} rows={4} />
      </ListPageShell>
    );
  }

  if (accountQuery.isError || !accountQuery.data) {
    return (
      <ListPageShell>
        <QueryErrorPanel
          error={accountQuery.error ?? new Error('WhatsApp account not found')}
          onRetry={() => void accountQuery.refetch()}
        />
      </ListPageShell>
    );
  }

  const { account, phoneNumbers } = accountQuery.data;
  const orgName = orgQuery.data?.name;
  const displayName = account.name?.trim() || account.metaWabaId;

  return (
    <ListPageShell className="space-y-8">
      <div className="space-y-5">
        <PlatformBackLink to={`/platform/organizations/${organizationId}`}>
          {orgName ? `Back to ${orgName}` : 'Back to client'}
        </PlatformBackLink>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <PlatformInitials name={displayName} className="h-11 w-11 text-sm" />
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-semibold tracking-tight">{displayName}</h1>
                <PlatformStatusPill
                  tone={getWhatsAppStatusTone(account.status)}
                  label={getWhatsAppStatusLabel(account.status)}
                />
              </div>
              <p className="font-mono text-sm text-muted-foreground">{account.metaWabaId}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-9" onClick={() => setEditingName(true)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit name
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => setDeleting(true)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        </div>

        {account.lastError ? (
          <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {account.lastError}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border/80 bg-background/70 px-5 py-4 sm:grid-cols-3">
          <PlatformStat label="Phone numbers" value={account.phoneNumberCount} />
          <PlatformStat label="Last synced" value={formatDateTime(account.lastSyncedAt)} />
          <PlatformStat label="Created" value={formatDateTime(account.createdAt)} />
        </div>
      </div>

      <Separator className="bg-border/70" />

      <div className="space-y-4">
        <PlatformSectionHeader
          title="Phone numbers"
          description="Numbers synced from Meta for this WhatsApp Business account"
        />

        {phoneNumbers.length > 0 ? (
          <ul className="overflow-hidden rounded-2xl border border-border/80 bg-background/70">
            {phoneNumbers.map((phone, index) => (
              <li
                key={phone.id}
                className={cn(
                  'flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between',
                  index > 0 && 'border-t border-border/70',
                )}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium tracking-tight">{phone.displayNumber}</p>
                      {phone.isDefault ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          <Star className="h-3 w-3 fill-current" />
                          Default
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {phone.verifiedName ?? 'Unverified'} · Quality {phone.qualityRating}
                      {phone.messagingTier ? ` · ${phone.messagingTier}` : ''}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {phone.metaPhoneNumberId}
                    </p>
                  </div>
                </div>
                <PlatformStatusPill
                  tone={
                    phone.status === 'ACTIVE'
                      ? 'success'
                      : phone.status === 'RESTRICTED'
                        ? 'danger'
                        : 'muted'
                  }
                  label={phone.status.charAt(0) + phone.status.slice(1).toLowerCase()}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No phone numbers"
            description="This account has no synced phone numbers yet."
          />
        )}
      </div>

      <EditWhatsAppAccountNameDialog
        organizationId={organizationId}
        account={editingName ? account : null}
        open={editingName}
        onOpenChange={setEditingName}
      />

      <DeleteWhatsAppAccountDialog
        organizationId={organizationId}
        account={deleting ? account : null}
        open={deleting}
        onOpenChange={setDeleting}
        onDeleted={() => navigate(`/platform/organizations/${organizationId}`)}
      />
    </ListPageShell>
  );
}
