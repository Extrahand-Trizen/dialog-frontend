import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRevokeApiKey } from '@/features/api-keys/hooks/useRevokeApiKey';

type RevokeApiKeyDialogProps = {
  apiKeyId: string | null;
  apiKeyName?: string;
  onClose: () => void;
};

export function RevokeApiKeyDialog({ apiKeyId, apiKeyName, onClose }: RevokeApiKeyDialogProps) {
  const revokeMutation = useRevokeApiKey();

  const handleRevoke = async () => {
    if (!apiKeyId) return;
    await revokeMutation.mutateAsync(apiKeyId);
    onClose();
  };

  return (
    <Dialog open={!!apiKeyId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Revoke API key</DialogTitle>
          <DialogDescription>
            {apiKeyName
              ? `Revoke "${apiKeyName}"? Integrations using this key will stop working immediately.`
              : 'Revoke this API key? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={revokeMutation.isPending}
            onClick={() => void handleRevoke()}
          >
            {revokeMutation.isPending ? 'Revoking…' : 'Revoke key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
