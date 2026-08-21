import { Link } from 'react-router-dom';
import { CheckSquare, Copy, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatWhatsAppAccountLabel } from '@/hooks/use-whatsapp-accounts';
import {
  META_TEMPLATE_STATUSES,
  TEMPLATE_CATEGORIES,
  type MetaTemplateStatus,
  type TemplateCategory,
} from '@/features/templates/types';
import { getTemplateStatusLabel } from '@/features/templates/utils/templateStatusLabels';
import type { WhatsAppAccountDto } from '@/features/whatsapp/types';
import { cn } from '@/lib/utils';

type TemplatesPageControlsProps = {
  accounts: WhatsAppAccountDto[];
  selectedAccountId?: string;
  onSelectedAccountIdChange?: (accountId: string) => void;
  canManage: boolean;
  isSyncing: boolean;
  onSyncAll: () => void;
  onCreate: () => void;
  onCopyToWaba?: () => void;
  onEnterSelectMode?: () => void;
  onCopySelected?: () => void;
  onDeleteSelected?: () => void;
  canCopyToWaba?: boolean;
  canSelectTemplates?: boolean;
  isSelecting?: boolean;
  selectedCount?: number;
  search: string;
  metaStatus: MetaTemplateStatus | undefined;
  category: TemplateCategory | undefined;
  totalTemplates?: number;
  onSearchChange: (value: string) => void;
  onMetaStatusChange: (value: MetaTemplateStatus | undefined) => void;
  onCategoryChange: (value: TemplateCategory | undefined) => void;
};

export function TemplatesPageControls({
  accounts,
  selectedAccountId,
  onSelectedAccountIdChange,
  canManage,
  isSyncing,
  onSyncAll,
  onCreate,
  onCopyToWaba,
  onEnterSelectMode,
  onCopySelected,
  onDeleteSelected,
  canCopyToWaba = false,
  canSelectTemplates = false,
  isSelecting = false,
  selectedCount = 0,
  search,
  metaStatus,
  category,
  totalTemplates,
  onSearchChange,
  onMetaStatusChange,
  onCategoryChange,
}: TemplatesPageControlsProps) {
  const selected = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const hasAccounts = accounts.length > 0;

  return (
    <Card className="overflow-hidden border-border/70 shadow-none">
      <CardContent className="space-y-3 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Connected WABA
            </p>
            {!hasAccounts ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Connect a WhatsApp Business account to create and manage templates.
                </p>
                {canManage ? (
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <Link to="/whatsapp">Go to WhatsApp setup</Link>
                  </Button>
                ) : null}
              </div>
            ) : accounts.length === 1 && selected ? (
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold tracking-tight">
                  {formatWhatsAppAccountLabel(selected)}
                </p>
                <span className="text-xs text-muted-foreground">WABA {selected.metaWabaId}</span>
                <StatusBadge status={selected.status} />
              </div>
            ) : selected ? (
              <Select value={selected.id} onValueChange={(value) => onSelectedAccountIdChange?.(value)}>
                <SelectTrigger className="h-9 w-full sm:max-w-md">
                  <SelectValue placeholder="Select connected WABA" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {formatWhatsAppAccountLabel(account)} · WABA {account.metaWabaId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {hasAccounts ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Approval status updates via Meta webhook. Sync imports templates from Meta — it does
                not change approval status.
              </p>
            ) : null}
          </div>

          {canManage && hasAccounts ? (
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="outline" className="h-9" disabled={isSyncing} onClick={onSyncAll}>
                <RefreshCw className={cn('mr-2 h-4 w-4', isSyncing && 'animate-spin')} />
                Sync all
              </Button>
              {canCopyToWaba && !isSelecting ? (
                <Button variant="outline" className="h-9" onClick={onCopyToWaba}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to WABA
                </Button>
              ) : null}
              {canSelectTemplates && !(isSelecting && selectedCount > 0 && !canCopyToWaba) ? (
                <Button
                  className="h-9"
                  variant={isSelecting && selectedCount > 0 ? 'default' : 'outline'}
                  disabled={isSelecting && selectedCount === 0}
                  onClick={() => {
                    if (!isSelecting) {
                      onEnterSelectMode?.();
                      return;
                    }
                    onCopySelected?.();
                  }}
                >
                  {isSelecting && selectedCount > 0 ? (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy selected
                    </>
                  ) : (
                    <>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Select
                    </>
                  )}
                </Button>
              ) : null}
              {canSelectTemplates && isSelecting && selectedCount > 0 ? (
                <Button variant="destructive" className="h-9" onClick={onDeleteSelected}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete selected
                </Button>
              ) : null}
              <Button className="h-9" onClick={onCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create template
              </Button>
            </div>
          ) : null}
        </div>

        <div className="border-t border-border/60 pt-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
            <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="template-search" className="text-xs font-medium text-muted-foreground">
                  Search
                </Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="template-search"
                    className="h-9 pl-9"
                    placeholder="Template name…"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                <Select
                  value={metaStatus ?? 'all'}
                  onValueChange={(value) =>
                    onMetaStatusChange(value === 'all' ? undefined : (value as MetaTemplateStatus))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {META_TEMPLATE_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {getTemplateStatusLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Category</Label>
                <Select
                  value={category ?? 'all'}
                  onValueChange={(value) =>
                    onCategoryChange(value === 'all' ? undefined : (value as TemplateCategory))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {TEMPLATE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {typeof totalTemplates === 'number' ? (
              <p className="shrink-0 text-xs text-muted-foreground lg:pb-2">
                <span className="font-medium text-foreground">{totalTemplates}</span> template
                {totalTemplates === 1 ? '' : 's'}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
