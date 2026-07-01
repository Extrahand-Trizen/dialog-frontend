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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { InlineError } from '@/components/shared/InlineError';
import { StatusBadge } from '@/components/shared/StatusBadge';
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

type PhoneNumbersPanelProps = {
  account: WhatsAppAccountDto;
};

export function PhoneNumbersPanel({ account }: PhoneNumbersPanelProps) {
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
    <Card
      className={cn(
        'overflow-hidden shadow-sm',
        account.status === 'ERROR' && 'border-destructive/40',
      )}
    >
      <CardHeader className="space-y-4 border-b bg-muted/20 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold">
                {account.name ?? account.metaWabaId}
              </h3>
              <StatusBadge status={account.status} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono">WABA {account.metaWabaId}</span>
              <span>
                {account.phoneNumberCount} phone{account.phoneNumberCount === 1 ? '' : 's'}
              </span>
              <span>Last synced {formatDateTime(account.lastSyncedAt)}</span>
            </div>
          </div>

          {canManage ? (
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={syncMutation.isPending}
                onClick={() => syncMutation.mutate(account.id)}
              >
                <RefreshCw
                  className={cn('mr-2 h-4 w-4', syncMutation.isPending && 'animate-spin')}
                />
                Sync
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Account actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={syncMutation.isPending}
                    onClick={() => syncMutation.mutate(account.id)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync phone numbers
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDisconnectOpen(true)}
                  >
                    <Unplug className="mr-2 h-4 w-4" />
                    Disconnect account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </div>

        {account.lastError ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {account.lastError}
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {!useMockData && phonesQuery.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        ) : !useMockData && phonesQuery.isError ? (
          <InlineError error={phonesQuery.error} onRetry={() => void phonesQuery.refetch()} />
        ) : phones && phones.length > 0 ? (
          <ul className="space-y-2">
            {phones.map((phone) => (
              <li
                key={phone.id}
                className="flex flex-col gap-3 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{phone.displayNumber}</p>
                      {phone.isDefault ? (
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <Star className="h-3 w-3 fill-current" />
                          Default
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {phone.verifiedName ?? 'Unverified'} · Quality {phone.qualityRating}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:pl-0 pl-12">
                  <StatusBadge status={phone.status} />
                  {canManage && !phone.isDefault ? (
                    <Button
                      variant="ghost"
                      size="sm"
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
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No phone numbers synced"
            description="Sync this account to pull phone numbers from Meta."
            action={
              canManage ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={syncMutation.isPending}
                  onClick={() => syncMutation.mutate(account.id)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync now
                </Button>
              ) : undefined
            }
          />
        )}
      </CardContent>

      {canManage ? (
        <DisconnectAccountDialog
          account={disconnectOpen ? account : null}
          onClose={() => setDisconnectOpen(false)}
        />
      ) : null}
    </Card>
  );
}
