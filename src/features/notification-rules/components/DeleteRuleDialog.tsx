import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteNotificationRule } from '@/features/notification-rules/hooks/useDeleteNotificationRule';

type DeleteRuleDialogProps = {
  ruleId: string | null;
  ruleName?: string;
  onClose: () => void;
};

export function DeleteRuleDialog({ ruleId, ruleName, onClose }: DeleteRuleDialogProps) {
  const deleteMutation = useDeleteNotificationRule();

  const handleDelete = async () => {
    if (!ruleId) return;
    await deleteMutation.mutateAsync(ruleId);
    onClose();
  };

  return (
    <Dialog open={!!ruleId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete notification rule</DialogTitle>
          <DialogDescription>
            {ruleName
              ? `Delete "${ruleName}"? Events matching this rule will no longer trigger messages.`
              : 'Delete this rule? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => void handleDelete()}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
