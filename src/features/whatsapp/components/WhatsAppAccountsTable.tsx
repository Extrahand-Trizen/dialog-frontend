import { Fragment, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { RefreshCw, Star, Unplug } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import type { PhoneNumberDto, WhatsAppAccountDto } from '@/features/whatsapp/types';
import { canManageWhatsApp } from '@/lib/permissions';
import { cn } from '@/lib/utils';

type WhatsAppAccountsTableProps = {
  accounts: WhatsAppAccountDto[];
};

export function WhatsAppAccountsTable({ accounts }: WhatsAppAccountsTableProps) {
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const canManage = canManageWhatsApp(user);
  const [disconnectAccount, setDisconnectAccount] = useState<WhatsAppAccountDto | null>(null);
  const syncMutation = useSyncAccount();
  const defaultPhoneMutation = useSetDefaultPhone();

  const phoneQueries = useQueries({
    queries: accounts.map((account) => ({
      queryKey: whatsappKeys.phoneNumbers(account.id),
      queryFn: () => listPhoneNumbers({ accountId: account.id }),
      enabled: !useMockData,
    })),
  });

  const phonesByAccount = accounts.map((account, index) => {
    const phones: PhoneNumberDto[] = useMockData
      ? getDevMockPhoneNumbers(account.id)
      : (phoneQueries[index]?.data ?? []);
    return { account, phones, isLoading: !useMockData && phoneQueries[index]?.isLoading };
  });

  return (
    <>
      <Card className="overflow-hidden border-border/70 shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10 text-xs">Account</TableHead>
                <TableHead className="h-10 text-xs">Status</TableHead>
                <TableHead className="h-10 text-xs">Phones</TableHead>
                <TableHead className="h-10 text-xs">Last synced</TableHead>
                <TableHead className="h-10 text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {phonesByAccount.map(({ account, phones, isLoading }) => (
                <Fragment key={account.id}>
                  <TableRow className="bg-muted/20">
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold tracking-tight">
                          {account.name ?? account.metaWabaId}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          WABA {account.metaWabaId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={account.status} />
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {account.phoneNumberCount}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(account.lastSyncedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {canManage ? (
                        <div className="inline-flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            disabled={syncMutation.isPending}
                            onClick={() => syncMutation.mutate(account.id)}
                          >
                            <RefreshCw
                              className={cn(
                                'mr-1.5 size-3.5',
                                syncMutation.isPending && 'animate-spin',
                              )}
                            />
                            Sync
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-destructive"
                            onClick={() => setDisconnectAccount(account)}
                          >
                            <Unplug className="mr-1.5 size-3.5" />
                            Disconnect
                          </Button>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-xs text-muted-foreground">
                        Loading phone numbers…
                      </TableCell>
                    </TableRow>
                  ) : phones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-xs text-muted-foreground">
                        No phone numbers synced for this account.
                      </TableCell>
                    </TableRow>
                  ) : (
                    phones.map((phone) => (
                      <TableRow key={phone.id}>
                        <TableCell className="pl-8">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium">{phone.displayNumber}</span>
                            {phone.isDefault ? (
                              <Badge variant="secondary" className="gap-0.5 text-[10px]">
                                <Star className="size-2.5 fill-current" />
                                Default
                              </Badge>
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {phone.verifiedName ?? 'Unverified'} · Quality {phone.qualityRating}
                          </p>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={phone.status} />
                        </TableCell>
                        <TableCell colSpan={2} className="text-xs text-muted-foreground">
                          Meta ID {phone.metaPhoneNumberId}
                        </TableCell>
                        <TableCell className="text-right">
                          {canManage && !phone.isDefault ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
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
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {canManage ? (
        <DisconnectAccountDialog
          account={disconnectAccount}
          onClose={() => setDisconnectAccount(null)}
        />
      ) : null}
    </>
  );
}
