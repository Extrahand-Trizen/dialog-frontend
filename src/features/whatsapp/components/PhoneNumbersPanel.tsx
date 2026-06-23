import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { InlineError } from '@/components/shared/InlineError';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDateTime } from '@/lib/format';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import { getDevMockPhoneNumbers } from '@/config/dev-mock-data';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { listPhoneNumbers } from '@/features/whatsapp/api/listPhoneNumbers';
import { useSetDefaultPhone } from '@/features/whatsapp/hooks/useSetDefaultPhone';
import { useSyncAccount } from '@/features/whatsapp/hooks/useSyncAccount';
import { whatsappKeys } from '@/features/whatsapp/queryKeys';
import type { WhatsAppAccountDto } from '@/features/whatsapp/types';
import { canManageWhatsApp } from '@/lib/permissions';

type PhoneNumbersPanelProps = {
  account: WhatsAppAccountDto;
};

export function PhoneNumbersPanel({ account }: PhoneNumbersPanelProps) {
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const canManage = canManageWhatsApp(user);
  const syncMutation = useSyncAccount();
  const defaultPhoneMutation = useSetDefaultPhone();

  const phonesQuery = useQuery({
    queryKey: whatsappKeys.phoneNumbers(account.id),
    queryFn: () => listPhoneNumbers({ accountId: account.id }),
    enabled: !useMockData,
  });

  const phones = useMockData ? getDevMockPhoneNumbers(account.id) : phonesQuery.data;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-base">{account.name ?? account.metaWabaId}</CardTitle>
          <p className="text-sm text-muted-foreground">WABA {account.metaWabaId}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={account.status} />
          {canManage ? (
            <Button
              variant="outline"
              size="sm"
              disabled={syncMutation.isPending}
              onClick={() => syncMutation.mutate(account.id)}
            >
              Sync
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          {account.phoneNumberCount} phone(s) · Last synced {formatDateTime(account.lastSyncedAt)}
        </p>
        {account.lastError ? (
          <p className="text-sm text-destructive">{account.lastError}</p>
        ) : null}

        {!useMockData && phonesQuery.isLoading ? (
          <Skeleton className="h-20" />
        ) : !useMockData && phonesQuery.isError ? (
          <InlineError error={phonesQuery.error} onRetry={() => void phonesQuery.refetch()} />
        ) : phones && phones.length > 0 ? (
          <ul className="divide-y rounded-md border">
            {phones.map((phone) => (
              <li
                key={phone.id}
                className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{phone.displayNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {phone.verifiedName ?? 'Unverified'} · {phone.qualityRating}
                    {phone.isDefault ? ' · Default' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
                  Sync now
                </Button>
              ) : undefined
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
