import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  MoreHorizontal,
  Phone,
  RefreshCw,
  Star,
  Unplug,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { InlineError } from '@/components/shared/InlineError';
import { formatDateTime } from '@/lib/format';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import { getDevMockPhoneNumbers } from '@/config/dev-mock-data';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { DisconnectAccountDialog } from '@/features/whatsapp/components/DisconnectAccountDialog';
import { listPhoneNumbers } from '@/features/whatsapp/api/listPhoneNumbers';
import { useSetDefaultPhone } from '@/features/whatsapp/hooks/useSetDefaultPhone';
import { useSyncAccount } from '@/features/whatsapp/hooks/useSyncAccount';
import { whatsappKeys } from '@/features/whatsapp/queryKeys';
import type { WhatsAppAccountDto } from '@/features/whatsapp/types';
import { canManageWhatsApp } from '@/lib/permissions';
import { cn } from '@/lib/utils';

type WhatsAppAccountCardProps = {
  account: WhatsAppAccountDto;
};

export function WhatsAppAccountCard({ account }: WhatsAppAccountCardProps) {
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const canManage = canManageWhatsApp(user);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const syncMutation = useSyncAccount();
  const defaultPhoneMutation = useSetDefaultPhone();

  const phonesQuery = useQuery({
    queryKey: whatsappKeys.phoneNumbers(account.id),
    queryFn: () => listPhoneNumbers({ accountId: account.id }),
    enabled: !useMockData,
  });

  const phones = useMockData ? getDevMockPhoneNumbers(account.id) : phonesQuery.data;

  return (
    <div
      className={cn(
        'flex h-fit flex-col rounded-2xl border border-border/70 bg-card',
        account.status === 'ERROR' && 'border-destructive/40',
      )}
    >
      <div className="flex items-start justify-between gap-2 border-b border-border/60 p-4">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold tracking-tight">
              {account.name ?? account.metaWabaId}
            </h3>
            <StatusBadge status={account.status} />
          </div>
          <p className="truncate font-mono text-[11px] text-muted-foreground">
            WABA {account.metaWabaId}
          </p>
        </div>
        {canManage ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Account actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={syncMutation.isPending}
                onClick={() => syncMutation.mutate(account.id)}
              >
                <RefreshCw className="mr-2 size-4" />
                Sync phones
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDisconnectOpen(true)}
              >
                <Unplug className="mr-2 size-4" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {account.phoneNumberCount} phone{account.phoneNumberCount === 1 ? '' : 's'}
          </span>
          <span>Synced {formatDateTime(account.lastSyncedAt)}</span>
        </div>

        {account.lastError ? (
          <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-2.5 py-1.5 text-xs text-destructive">
            {account.lastError}
          </p>
        ) : null}

        <div>
          {!useMockData && phonesQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          ) : !useMockData && phonesQuery.isError ? (
            <InlineError error={phonesQuery.error} onRetry={() => void phonesQuery.refetch()} />
          ) : phones && phones.length > 0 ? (
            <ul className="space-y-2">
              {phones.map((phone) => (
                <li
                  key={phone.id}
                  className="rounded-xl border border-border/60 bg-muted/20 p-2.5"
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-background">
                      <Phone className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-sm font-medium">{phone.displayNumber}</p>
                        {phone.isDefault ? (
                          <Badge variant="secondary" className="gap-0.5 text-[10px]">
                            <Star className="size-2.5 fill-current" />
                            Default
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={phone.status} />
                        {canManage && !phone.isDefault ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-[11px]"
                            disabled={defaultPhoneMutation.isPending}
                            onClick={() =>
                              defaultPhoneMutation.mutate({
                                accountId: account.id,
                                phoneId: phone.id,
                              })
                            }
                          >
                            Set default
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No phone numbers synced yet.</p>
          )}
        </div>

        {canManage ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full"
            disabled={syncMutation.isPending}
            onClick={() => syncMutation.mutate(account.id)}
          >
            <RefreshCw className={cn('mr-2 size-3.5', syncMutation.isPending && 'animate-spin')} />
            Sync
          </Button>
        ) : null}
      </div>

      {canManage ? (
        <DisconnectAccountDialog
          account={disconnectOpen ? account : null}
          onClose={() => setDisconnectOpen(false)}
        />
      ) : null}
    </div>
  );
}
