import { ArrowLeft } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ContactAvatar } from '@/features/inbox/components/ContactAvatar';
import { formatDisplayPhone } from '@/features/inbox/formatPhone';

type ThreadHeaderProps = {
  contactPhone: string;
  canSendFreeText: boolean;
  freeTextWindowExpiresAt?: string | null;
  onBack?: () => void;
};

export function ThreadHeader({
  contactPhone,
  canSendFreeText,
  freeTextWindowExpiresAt,
  onBack,
}: ThreadHeaderProps) {
  const windowHint = canSendFreeText
    ? freeTextWindowExpiresAt
      ? `Free-text open · closes ${formatDistanceToNowStrict(new Date(freeTextWindowExpiresAt), { addSuffix: true })}`
      : 'Free-text replies are open'
    : 'Template only · customer must reply to unlock free text';

  return (
    <div className="flex items-center gap-3 border-b bg-background px-3 py-2.5 sm:px-4">
      {onBack ? (
        <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
      ) : null}
      <ContactAvatar phone={contactPhone} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{formatDisplayPhone(contactPhone)}</p>
        <p className="truncate text-xs text-muted-foreground">{windowHint}</p>
      </div>
    </div>
  );
}
