import { Link2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type WhatsAppSetupHeaderProps = {
  accountCount: number;
  phoneCount: number;
  canManage: boolean;
  onConnect: () => void;
};

export function WhatsAppSetupHeader({
  accountCount,
  phoneCount,
  canManage,
  onConnect,
}: WhatsAppSetupHeaderProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Link2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              {accountCount === 0
                ? 'No WhatsApp accounts connected'
                : `${accountCount} connected account${accountCount === 1 ? '' : 's'}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {accountCount === 0
                ? 'Link your Meta WhatsApp Business Account to sync phone numbers and templates.'
                : `${phoneCount} phone number${phoneCount === 1 ? '' : 's'} synced across your accounts.`}
            </p>
          </div>
        </div>
        {canManage ? (
          <Button onClick={onConnect} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Connect account
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
