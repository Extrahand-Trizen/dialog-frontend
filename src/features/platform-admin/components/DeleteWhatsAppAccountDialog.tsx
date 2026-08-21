import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteWhatsAppAccount } from '@/features/platform-admin/hooks/useDeleteWhatsAppAccount';
import type { PlatformWhatsAppAccount } from '@/features/platform-admin/types';

type DeleteWhatsAppAccountDialogProps = {
  organizationId: string;
  account: PlatformWhatsAppAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
};

export function DeleteWhatsAppAccountDialog({
  organizationId,
  account,
  open,
  onOpenChange,
  onDeleted,
}: DeleteWhatsAppAccountDialogProps) {
  const deleteMutation = useDeleteWhatsAppAccount(organizationId);
  const accountLabel = account?.name?.trim() || account?.metaWabaId;

  const handleDelete = async () => {
    if (!account) {
      return;
    }
    await deleteMutation.mutateAsync(account.id);
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove WhatsApp account</DialogTitle>
          <DialogDescription>
            {accountLabel
              ? `Remove “${accountLabel}” from this client? This permanently unlinks the WhatsApp account, soft-deletes its templates, and deletes related message history needed to free the account.`
              : 'Remove this WhatsApp account from the client? This permanently unlinks it.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending || !account}
            onClick={() => void handleDelete()}
          >
            {deleteMutation.isPending ? 'Removing…' : 'Remove account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
