import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Megaphone, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/EmptyState';
import { FilterPanel, ListPageShell, TablePanel } from '@/components/shared/ListPageLayout';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TablePagination } from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { CampaignStatusBadge } from '@/features/campaigns/components/CampaignStatusBadge';
import { listCampaigns } from '@/features/campaigns/api/campaignsApi';
import { formatCampaignTime } from '@/features/campaigns/formatCampaign';
import { campaignKeys } from '@/features/campaigns/queryKeys';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTableParams } from '@/hooks/use-table-params';
import { canSendMessages } from '@/lib/permissions';

const FILTER_DEFAULTS = { search: undefined as string | undefined };

export function CampaignHistoryPage() {
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const canSend = canSendMessages(user);
  const { params, setParams } = useTableParams(FILTER_DEFAULTS);
  const [searchInput, setSearchInput] = useState(params.search ?? '');
  const search = useDebouncedValue(searchInput);

  const queryParams = useMemo(
    () => ({ page: params.page, limit: params.limit, search: search || undefined }),
    [params.page, params.limit, search],
  );

  const historyQuery = useQuery({
    queryKey: campaignKeys.list(queryParams),
    queryFn: () => listCampaigns(queryParams),
    enabled: canSend && !useMockData,
    placeholderData: (prev) => prev,
    refetchInterval: (query) => {
      const items = query.state.data?.items ?? [];
      return items.some((item) => item.queuedCount > 0 || item.status === 'sending') ? 4000 : false;
    },
  });

  if (!canSend) {
    return (
      <EmptyState
        title="Campaign history unavailable"
        description="Your role cannot send WhatsApp messages."
      />
    );
  }

  if (useMockData) {
    return (
      <EmptyState
        title="Connect the backend"
        description="Campaign history is stored on the API."
      />
    );
  }

  const items = historyQuery.data?.items ?? [];
  const meta = historyQuery.data?.meta;

  return (
    <ListPageShell>
      <FilterPanel
        actions={
          <Button asChild className="h-9">
            <Link to="/campaigns">
              <Megaphone className="size-4" />
              New campaign
            </Link>
          </Button>
        }
      >
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 pl-8"
            placeholder="Search campaigns"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              setParams({ page: 1, search: event.target.value || undefined });
            }}
          />
        </div>
      </FilterPanel>

      {historyQuery.isError ? (
        <QueryErrorPanel
          title="Could not load history"
          error={historyQuery.error}
          onRetry={() => void historyQuery.refetch()}
        />
      ) : historyQuery.isLoading ? (
        <TableSkeleton columns={3} rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="When you send a campaign, it will appear here."
          action={
            <Button asChild>
              <Link to="/campaigns">New campaign</Link>
            </Button>
          }
        />
      ) : (
        <TablePanel>
          <ul className="divide-y divide-border/60">
            {items.map((campaign) => {
              const title =
                campaign.name && campaign.name !== campaign.templateName
                  ? campaign.name
                  : campaign.templateName;
              return (
                <li key={campaign.id}>
                  <Link
                    to={`/campaigns/history/${campaign.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium">{title}</p>
                        <CampaignStatusBadge status={campaign.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatCampaignTime(campaign.createdAt)}
                        {campaign.language ? ` · ${campaign.language}` : ''}
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right text-xs tabular-nums text-muted-foreground sm:block">
                      <p>
                        {campaign.recipientCount} recipient
                        {campaign.recipientCount === 1 ? '' : 's'}
                      </p>
                      <p className="mt-0.5">
                        {(campaign.sentCount ?? 0)} sent
                        {campaign.queuedCount > 0 ? ` · ${campaign.queuedCount} queued` : ''}
                        {campaign.failedCount > 0 ? ` · ${campaign.failedCount} failed` : ''}
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
          {meta ? (
            <div className="px-4 pb-3">
              <TablePagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                onPageChange={(page) => setParams({ page })}
              />
            </div>
          ) : null}
        </TablePanel>
      )}
    </ListPageShell>
  );
}
