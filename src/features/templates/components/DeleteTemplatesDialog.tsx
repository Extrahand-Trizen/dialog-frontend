import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatWhatsAppAccountLabel } from '@/hooks/use-whatsapp-accounts';
import { useDeleteTemplates } from '@/features/templates/hooks/useDeleteTemplates';
import type { WhatsAppAccountDto } from '@/features/whatsapp/types';

type DeleteTemplatesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: WhatsAppAccountDto;
  templateIds: string[];
  onDeleted: () => void;
};

export function DeleteTemplatesDialog({
  open,
  onOpenChange,
  account,
  templateIds,
  onDeleted,
}: DeleteTemplatesDialogProps) {
  const deleteMutation = useDeleteTemplates();
  const count = templateIds.length;
  const accountLabel = account ? formatWhatsAppAccountLabel(account) : 'this WABA';

  const handleDelete = async () => {
    if (!account || count < 1) return;
    const result = await deleteMutation.mutateAsync({
      whatsAppAccountId: account.id,
      templateIds,
    });
    if (result.deletedCount === 0 && result.skippedCount + result.failedCount > 0) {
      return;
    }
    onDeleted();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete templates</DialogTitle>
          <DialogDescription>
            Delete {count} template{count === 1 ? '' : 's'} from {accountLabel}? This also deletes
            them from Meta for this WABA and cannot be undone. Templates used by notification rules
            are skipped.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!account || count < 1 || deleteMutation.isPending}
            onClick={() => void handleDelete()}
          >
            {deleteMutation.isPending ? 'Deleting…' : `Delete ${count}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
