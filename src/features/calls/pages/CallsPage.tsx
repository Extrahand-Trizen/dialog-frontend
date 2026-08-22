import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Bell, Phone, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterPanel, ListPageShell, TablePanel } from '@/components/shared/ListPageLayout';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import type { CallHistoryFilter } from '../types';
import { listCallContacts, listCalls } from '../api/callsApi';
import { callKeys } from '../queryKeys';
import { CallsFilters, CallsHistoryList } from '../components/CallsHistoryList';
import { ComingSoonNotice } from '@/features/voice/ComingSoon';
import { isFeatureEnabled } from '@/config/features';
import { useCalling } from '../CallingProvider';

export function CallsPage() {
  const [filter, setFilter] = useState<CallHistoryFilter>('all');
  const [search, setSearch] = useState('');
  const callingLive = isFeatureEnabled('callingLive');
  const { openConfirm } = useCalling();

  const query = useQuery({
    queryKey: callKeys.list({ filter, search }),
    queryFn: () => listCalls({ page: 1, limit: 50, filter, search }),
  });
  const contactsQuery = useQuery({
    queryKey: callKeys.contacts(),
    queryFn: listCallContacts,
  });

  return (
    <ListPageShell>
      <ComingSoonNotice
        description="Place and receive calls from this page when Trizen Voice is live. Contact calling is not available yet."
      />

      <FilterPanel
        actions={
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto">
            <Button asChild variant="outline" className="h-9">
              <Link to="/calls/notifications">
                <Bell className="size-4" />
                Notifications
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-9">
              <Link to="/calls/settings">
                <PhoneCall className="size-4" />
                Calling settings
              </Link>
            </Button>
          </div>
        }
      >
        <CallsFilters
          filter={filter}
          search={search}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
        />
      </FilterPanel>

      {contactsQuery.data && contactsQuery.data.length > 0 ? (
        <div className="min-w-0 max-w-full space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Contacts
          </p>
          <ul className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {contactsQuery.data.slice(0, 24).map((contact) => (
              <li key={contact.id} className="shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto gap-2 px-3 py-2"
                  disabled={!callingLive}
                  onClick={() => callingLive && void openConfirm(contact)}
                >
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${contact.avatarColor}`}
                  >
                    {contact.avatarInitials}
                  </span>
                  <span className="max-w-[9rem] truncate text-left">
                    <span className="block text-sm">{contact.name}</span>
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      Call · Coming soon
                    </span>
                  </span>
                  <Phone className="size-3.5 text-muted-foreground" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {query.isLoading ? (
        <TableSkeleton />
      ) : query.isError ? (
        <QueryErrorPanel error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <TablePanel>
          <CallsHistoryList calls={query.data?.items ?? []} callingLive={callingLive} />
        </TablePanel>
      )}
    </ListPageShell>
  );
}
