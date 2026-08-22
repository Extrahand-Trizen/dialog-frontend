import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { QueryErrorPanel } from '@/components/shared/QueryErrorPanel';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { activateVirtualNumber, listAvailableNumbers } from '../api/voiceApi';
import { voiceKeys } from '../queryKeys';
import type { InventoryNumber } from '../types';
import { BlurredNumber, BlurredText, ComingSoonButton, ComingSoonNotice } from '../ComingSoon';
import { isFeatureEnabled } from '@/config/features';

export function GetNumberPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [country, setCountry] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<InventoryNumber | null>(null);
  const [phase, setPhase] = useState<'idle' | 'provisioning' | 'done'>('idle');
  const [activatedId, setActivatedId] = useState<string | null>(null);
  const callingLive = isFeatureEnabled('callingLive');

  const catalog = useQuery({
    queryKey: voiceKeys.catalog(country || undefined),
    queryFn: () => listAvailableNumbers(country || undefined),
  });
  const purchase = useMutation({
    mutationFn: (inventoryId: string) =>
      activateVirtualNumber({ inventoryId, assignedApplication: 'Website' }),
  });

  if (catalog.isLoading) return <TableSkeleton />;
  if (catalog.isError) {
    return <QueryErrorPanel error={catalog.error} onRetry={() => void catalog.refetch()} />;
  }
  const data = catalog.data;
  if (!data) return null;

  const filtered = data.numbers.filter((item) => {
    if (!search.trim()) return true;
    const q = search.replace(/\D/g, '').toLowerCase();
    return (
      item.e164.includes(q) ||
      item.displayNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.locality.toLowerCase().includes(search.toLowerCase())
    );
  });

  async function confirmPurchase() {
    if (!selected) return;
    setPhase('provisioning');
    try {
      const number = await purchase.mutateAsync(selected.id);
      await queryClient.invalidateQueries({ queryKey: voiceKeys.all });
      setActivatedId(number.id);
      setPhase('done');
    } catch {
      setPhase('idle');
    }
  }

  return (
    <div className="mx-auto min-w-0 max-w-3xl space-y-4 overflow-x-clip">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/virtual-numbers">
          <ArrowLeft className="size-4" />
          My numbers
        </Link>
      </Button>

      <ComingSoonNotice
        title="Get a number — coming soon"
        description="Browse the catalog as a preview. Purchase, monthly pricing, and live calling are not available yet."
      />

      <Card className="min-w-0 border-border/70 shadow-none">
        <CardContent className="space-y-3 p-3 sm:p-4">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              className="h-8"
              variant={country === '' ? 'default' : 'outline'}
              onClick={() => setCountry('')}
            >
              All countries
            </Button>
            {data.countries.map((item) => (
              <Button
                key={item.code}
                type="button"
                size="sm"
                className="h-8"
                variant={country === item.code ? 'default' : 'outline'}
                onClick={() => setCountry(item.code)}
              >
                {item.name}
              </Button>
            ))}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 pl-9"
              placeholder="Search number or city"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="No numbers in this country"
          description="Try another country or a different search."
        />
      ) : (
        <ul className="min-w-0 divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-card">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="flex min-w-0 flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold">
                  <BlurredNumber value={item.displayNumber} />
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {item.countryName} · {item.locality}
                </p>
                <p className="mt-1.5 flex min-w-0 items-baseline gap-1.5 text-sm">
                  <BlurredText value={item.price.display} className="font-medium" />
                  <span className="shrink-0 text-xs text-muted-foreground">/ month</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Voice · In · Out · Masking</p>
              </div>
              {callingLive ? (
                <Button
                  type="button"
                  size="sm"
                  className="shrink-0 self-end sm:self-center"
                  onClick={() => setSelected(item)}
                >
                  Get Number
                </Button>
              ) : (
                <ComingSoonButton className="shrink-0 self-end sm:self-center">
                  Get Number · Coming soon
                </ComingSoonButton>
              )}
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={callingLive && !!selected}
        onOpenChange={(open) => {
          if (!open && phase !== 'provisioning') {
            setSelected(null);
            setPhase('idle');
            setActivatedId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {phase === 'done' && activatedId ? (
            <>
              <DialogHeader>
                <DialogTitle>Number ready</DialogTitle>
                <DialogDescription>
                  {selected?.displayNumber} is assigned to your organization and ready to use.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => {
                    const id = activatedId;
                    setSelected(null);
                    setPhase('idle');
                    navigate(`/virtual-numbers/${id}`);
                  }}
                >
                  Manage Number
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Get this number?</DialogTitle>
                <DialogDescription>
                  {selected
                    ? `${selected.displayNumber} · ${selected.countryName} · ${selected.locality}`
                    : ''}
                </DialogDescription>
              </DialogHeader>
              {selected ? (
                <div className="space-y-2 text-sm">
                  <p className="flex flex-wrap items-baseline gap-1.5">
                    Monthly rental
                    <BlurredText value={selected.price.display} className="font-medium" />
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Incoming calling</li>
                    <li>Outgoing calling</li>
                    <li>Number masking</li>
                  </ul>
                  <p className="text-xs text-muted-foreground">Assigned to the current organization.</p>
                </div>
              ) : null}
              {purchase.isError ? (
                <p className="text-sm text-destructive">
                  {(purchase.error as Error).message || 'Could not get that number.'}
                </p>
              ) : null}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={phase === 'provisioning'}
                  onClick={() => {
                    setSelected(null);
                    setPhase('idle');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={phase === 'provisioning'}
                  onClick={() => void confirmPurchase()}
                >
                  {phase === 'provisioning' ? 'Provisioning number…' : 'Get Number'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
