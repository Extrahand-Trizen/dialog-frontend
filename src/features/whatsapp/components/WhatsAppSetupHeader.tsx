import { LayoutGrid, Link2, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ViewMode = 'cards' | 'table';

type WhatsAppSetupHeaderProps = {
  accountCount: number;
  phoneCount: number;
  canManage: boolean;
  onConnect: () => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean;
};

export function WhatsAppSetupHeader({
  accountCount,
  phoneCount,
  canManage,
  onConnect,
  viewMode = 'cards',
  onViewModeChange,
  showViewToggle = false,
}: WhatsAppSetupHeaderProps) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Link2 className="size-4" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-semibold tracking-tight">
              {accountCount === 0
                ? 'No WhatsApp accounts connected'
                : `${accountCount} connected account${accountCount === 1 ? '' : 's'}`}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {accountCount === 0
                ? 'Link your Meta WhatsApp Business Account to sync phone numbers and templates.'
                : `${phoneCount} phone number${phoneCount === 1 ? '' : 's'} synced across your accounts.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showViewToggle && onViewModeChange ? (
            <div className="inline-flex rounded-lg border border-border/70 p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 gap-1.5 rounded-md px-2.5',
                  viewMode === 'cards' && 'bg-muted text-foreground',
                )}
                onClick={() => onViewModeChange('cards')}
              >
                <LayoutGrid className="size-3.5" />
                Cards
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 gap-1.5 rounded-md px-2.5',
                  viewMode === 'table' && 'bg-muted text-foreground',
                )}
                onClick={() => onViewModeChange('table')}
              >
                <List className="size-3.5" />
                Table
              </Button>
            </div>
          ) : null}
          {canManage ? (
            <Button onClick={onConnect} className="h-9 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Connect account
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
