import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactAvatar } from '@/features/inbox/components/ContactAvatar';

type ThreadHeaderProps = {
  contactPhone: string;
  canSendFreeText: boolean;
  onBack?: () => void;
};

export function ThreadHeader({ contactPhone, canSendFreeText, onBack }: ThreadHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b bg-background px-4 py-3">
      {onBack ? (
        <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
      ) : null}
      <ContactAvatar phone={contactPhone} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">+{contactPhone}</p>
        <p className="text-xs text-muted-foreground">
          {canSendFreeText ? 'Reply window open' : 'Reply window closed — template only'}
        </p>
      </div>
    </div>
  );
}
