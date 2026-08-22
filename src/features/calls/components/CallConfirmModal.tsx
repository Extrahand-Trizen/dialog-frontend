import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Shield } from 'lucide-react';
import { useCalling } from '../CallingProvider';

export function CallConfirmModal() {
  const { pendingContact, cancelConfirm, startOutgoing, errorMessage } = useCalling();
  const [busy, setBusy] = useState(false);

  return (
    <Dialog open={!!pendingContact} onOpenChange={(open) => !open && cancelConfirm()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start masked call</DialogTitle>
          <DialogDescription>
            Connect privately through your Trizen virtual number.
          </DialogDescription>
        </DialogHeader>

        {pendingContact ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
              <div
                className={`flex size-11 items-center justify-center rounded-full text-sm font-semibold text-white ${pendingContact.avatarColor}`}
              >
                {pendingContact.avatarInitials}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{pendingContact.name}</p>
                <p className="text-sm text-muted-foreground">{pendingContact.maskedPhone}</p>
              </div>
            </div>

            <div className="flex gap-2 rounded-lg border border-emerald-200/70 bg-emerald-50/80 px-3 py-2.5 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100">
              <Shield className="mt-0.5 size-4 shrink-0" />
              <p>Your personal number stays private. The call uses your Trizen virtual number.</p>
            </div>
            {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={cancelConfirm} disabled={busy}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void startOutgoing().finally(() => setBusy(false));
            }}
          >
            <Phone className="size-4" />
            {busy ? 'Connecting…' : 'Call'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
