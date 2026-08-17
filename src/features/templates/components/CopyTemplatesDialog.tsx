import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatWhatsAppAccountLabel } from '@/hooks/use-whatsapp-accounts';
import { useCopyTemplates } from '@/features/templates/hooks/useCopyTemplates';
import type { WhatsAppAccountDto } from '@/features/whatsapp/types';
import { cn } from '@/lib/utils';

type CopyTemplatesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceAccount?: WhatsAppAccountDto;
  targetAccounts: WhatsAppAccountDto[];
  selectedTemplateIds: string[];
  onCopied: () => void;
};

export function CopyTemplatesDialog({
  open,
  onOpenChange,
  sourceAccount,
  targetAccounts,
  selectedTemplateIds,
  onCopied,
}: CopyTemplatesDialogProps) {
  const copyMutation = useCopyTemplates();
  const [targetAccountId, setTargetAccountId] = useState<string | undefined>();
  const [scope, setScope] = useState<'selected' | 'all'>(
    selectedTemplateIds.length > 0 ? 'selected' : 'all',
  );

  useEffect(() => {
    if (!open) return;
    setTargetAccountId((current) =>
      current && targetAccounts.some((account) => account.id === current)
        ? current
        : targetAccounts[0]?.id,
    );
    setScope(selectedTemplateIds.length > 0 ? 'selected' : 'all');
  }, [open, selectedTemplateIds.length, targetAccounts]);

  const selectedCount = selectedTemplateIds.length;
  const canUseSelected = selectedCount > 0;
  const sourceLabel = sourceAccount ? formatWhatsAppAccountLabel(sourceAccount) : 'this WABA';

  const destLabel = useMemo(() => {
    const account = targetAccounts.find((item) => item.id === targetAccountId);
    return account ? formatWhatsAppAccountLabel(account) : 'another WABA';
  }, [targetAccountId, targetAccounts]);

  const canSubmit =
    Boolean(sourceAccount && targetAccountId) &&
    !copyMutation.isPending &&
    (scope === 'all' || selectedCount > 0);

  const handleCopy = async () => {
    if (!sourceAccount || !targetAccountId || !canSubmit) return;
    const result = await copyMutation.mutateAsync({
      sourceWhatsAppAccountId: sourceAccount.id,
      targetWhatsAppAccountId: targetAccountId,
      ...(scope === 'all'
        ? { copyAll: true }
        : { templateIds: selectedTemplateIds }),
    });
    if (result.copiedCount + result.skippedCount === 0) {
      return;
    }
    onCopied();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Copy templates to another WABA</DialogTitle>
          <DialogDescription>
            Submit copies from {sourceLabel} to Meta on the destination account. Existing names are
            skipped. New copies still need Meta approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Destination WABA</Label>
            <Select value={targetAccountId} onValueChange={setTargetAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select WABA" />
              </SelectTrigger>
              <SelectContent>
                {targetAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {formatWhatsAppAccountLabel(account)} · WABA {account.metaWabaId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Templates to copy</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={scope === 'selected' ? 'default' : 'outline'}
                disabled={!canUseSelected}
                onClick={() => setScope('selected')}
                className={cn(!canUseSelected && 'opacity-60')}
              >
                Selected ({selectedCount})
              </Button>
              <Button
                type="button"
                variant={scope === 'all' ? 'default' : 'outline'}
                onClick={() => setScope('all')}
              >
                All templates on this WABA
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {scope === 'selected'
                ? `${selectedCount} selected template${selectedCount === 1 ? '' : 's'} will be submitted to ${destLabel}.`
                : `All templates on ${sourceLabel} will be submitted to ${destLabel}.`}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={() => void handleCopy()}
          >
            {copyMutation.isPending
              ? 'Copying…'
              : scope === 'all'
                ? 'Copy all'
                : `Copy ${selectedCount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
