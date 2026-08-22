import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListPageShell } from '@/components/shared/ListPageLayout';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import {
  CampaignStatusBadge,
  RecipientStatusBadge,
} from '@/features/campaigns/components/CampaignStatusBadge';
import { getCampaign } from '@/features/campaigns/api/campaignsApi';
import { formatCampaignTime } from '@/features/campaigns/formatCampaign';
import { campaignKeys } from '@/features/campaigns/queryKeys';
import { formatDisplayPhone } from '@/features/inbox/formatPhone';

export function CampaignHistoryDetailPage() {
  const { campaignId = '' } = useParams();
  const detailQuery = useQuery({
    queryKey: campaignKeys.detail(campaignId),
    queryFn: () => getCampaign(campaignId),
    enabled: !!campaignId,
    refetchInterval: (query) => {
      const recipients = query.state.data?.recipients ?? [];
      const pending = recipients.some(
        (row) => row.status === 'queued' || row.status === 'sending' || row.status === 'pending',
      );
      return pending ? 4000 : false;
    },
  });

  if (detailQuery.isError) {
    return (
      <QueryErrorPanel
        title="Could not load campaign"
        error={detailQuery.error}
        onRetry={() => void detailQuery.refetch()}
      />
    );
  }

  if (detailQuery.isLoading || !detailQuery.data) {
    return (
      <ListPageShell>
        <TableSkeleton columns={2} rows={8} />
      </ListPageShell>
    );
  }

  const campaign = detailQuery.data;
  const recipients = campaign.recipients ?? [];
  const title =
    campaign.name && campaign.name !== campaign.templateName
      ? campaign.name
      : campaign.templateName;

  return (
    <ListPageShell>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/campaigns/history">
            <ArrowLeft className="mr-1.5 size-4" />
            History
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/campaigns">New campaign</Link>
        </Button>
      </div>

      <Card className="border-border/70 shadow-none">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
                <CampaignStatusBadge status={campaign.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatCampaignTime(campaign.createdAt)}
                {campaign.language ? ` · ${campaign.language}` : ''}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Sent" value={campaign.sentCount} />
            <Stat label="Queued" value={campaign.queuedCount} />
            <Stat label="Failed" value={campaign.failedCount} />
          </div>
        </CardContent>
      </Card>

      {recipients.length === 0 ? (
        <EmptyState title="No recipients" description="This campaign has no stored recipient rows." />
      ) : (
        <Card className="border-border/70 shadow-none">
          <CardContent className="p-0">
            <div className="border-b border-border/60 px-4 py-2.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Recipients
              </p>
            </div>
            <ul className="max-h-[28rem] divide-y divide-border/60 overflow-y-auto">
              {recipients.map((row) => (
                <li
                  key={row.phone}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium tabular-nums">
                      {formatDisplayPhone(row.phone)}
                    </p>
                    {row.error ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-destructive">{row.error}</p>
                    ) : null}
                  </div>
                  <RecipientStatusBadge status={row.status} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </ListPageShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
