import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDisconnectAccount } from '@/features/whatsapp/hooks/useDisconnectAccount';
import type { WhatsAppAccountDto } from '@/features/whatsapp/types';

type DisconnectAccountDialogProps = {
  account: WhatsAppAccountDto | null;
  onClose: () => void;
};

export function DisconnectAccountDialog({ account, onClose }: DisconnectAccountDialogProps) {
  const disconnectMutation = useDisconnectAccount();

  const handleDisconnect = async () => {
    if (!account) return;
    await disconnectMutation.mutateAsync(account.id);
    onClose();
  };

  const accountLabel = account?.name ?? account?.metaWabaId;

  return (
    <Dialog open={!!account} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Disconnect WhatsApp account</DialogTitle>
          <DialogDescription>
            {accountLabel
              ? `Disconnect "${accountLabel}"? This removes the link between your platform and Meta for this WABA, unsubscribes webhooks, and deletes synced phone numbers from Dialog.`
              : 'Disconnect this WhatsApp account? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={disconnectMutation.isPending}
            onClick={() => void handleDisconnect()}
          >
            {disconnectMutation.isPending ? 'Disconnecting…' : 'Disconnect'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
