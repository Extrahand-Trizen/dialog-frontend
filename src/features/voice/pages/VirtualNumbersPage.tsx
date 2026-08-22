import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { FilterPanel, ListPageShell, TablePanel } from '@/components/shared/ListPageLayout';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { listVirtualNumbers } from '../api/voiceApi';
import { voiceKeys } from '../queryKeys';
import { BlurredNumber, ComingSoonButton, ComingSoonNotice } from '../ComingSoon';

export function VirtualNumbersPage() {
  const query = useQuery({
    queryKey: voiceKeys.numbers(),
    queryFn: listVirtualNumbers,
  });

  return (
    <ListPageShell>
      <ComingSoonNotice
        description="Virtual numbers are previewed here. Purchase and live calling are coming soon. Numbers stay blurred until Voice is live."
      />
      <FilterPanel
        actions={
          <ComingSoonButton className="h-9" size="default">
            Get a number · Coming soon
          </ComingSoonButton>
        }
      >
        <div className="space-y-1">
          <p className="text-sm font-medium">My numbers</p>
          <p className="text-xs text-muted-foreground">
            Manage virtual numbers for business calling and masking. Activation is coming soon.
          </p>
        </div>
      </FilterPanel>

      {query.isLoading ? (
        <TableSkeleton />
      ) : query.isError ? (
        <QueryErrorPanel error={query.error} onRetry={() => void query.refetch()} />
      ) : !query.data?.length ? (
        <EmptyState
          title="No virtual numbers yet"
          description="Choose a country, pick a number, and get it for calling on your site."
          action={
            <ComingSoonButton size="default">Get a number · Coming soon</ComingSoonButton>
          }
        />
      ) : (
        <TablePanel>
          <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-card">
            {query.data.map((number) => (
              <li
                key={number.id}
                className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/virtual-numbers/${number.id}`}
                      className="font-mono text-sm font-semibold hover:underline"
                    >
                      <BlurredNumber value={number.displayNumber} />
                    </Link>
                    <Badge variant={number.status === 'active' ? 'secondary' : 'outline'}>
                      {number.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {number.countryName} · {number.locality}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Incoming: {number.incomingEnabled ? 'Enabled' : 'Off'} · Outgoing:{' '}
                    {number.outgoingEnabled ? 'Enabled' : 'Off'}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Inbound: {number.inboundCount} · Outbound: {number.outboundCount} · Minutes:{' '}
                    {number.minutesUsed}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/virtual-numbers/${number.id}`}>
                    <Phone className="size-3.5" />
                    Manage
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </TablePanel>
      )}
    </ListPageShell>
  );
}
