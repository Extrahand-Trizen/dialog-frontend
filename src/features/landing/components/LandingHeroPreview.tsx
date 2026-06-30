import { CheckCheck } from 'lucide-react';

export function LandingHeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-primary/15 blur-2xl"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-xl">
        <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            EH
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">ExtraHand</p>
            <p className="text-xs text-muted-foreground">Business account</p>
          </div>
        </div>
        <div className="space-y-3 bg-[#e5ddd5] p-4 dark:bg-muted/40">
          <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-3 py-2 text-sm shadow-sm dark:bg-primary/20">
            <p className="font-medium text-foreground">Booking confirmed</p>
            <p className="mt-1 text-foreground/90">
              Hi Alex, your service on 20 Jun is confirmed. Ref BK-2048.
            </p>
            <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
              <span>10:42</span>
              <CheckCheck className="size-3.5 text-sky-600" />
            </div>
          </div>
          <div className="max-w-[85%] rounded-lg rounded-tl-none bg-card px-3 py-2 text-sm shadow-sm">
            <p className="text-foreground/90">Thanks! See you then.</p>
            <p className="mt-1 text-right text-[10px] text-muted-foreground">10:43</p>
          </div>
        </div>
        <div className="border-t bg-card px-4 py-2.5 text-center text-xs text-muted-foreground">
          Template · Utility · Approved
        </div>
      </div>
    </div>
  );
}
