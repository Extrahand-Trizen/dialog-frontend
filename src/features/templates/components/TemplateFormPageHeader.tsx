import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatWhatsAppAccountLabel } from '@/hooks/use-whatsapp-accounts';
import type { WhatsAppAccountDto } from '@/features/whatsapp/types';

type TemplateFormPageHeaderProps = {
  mode: 'create' | 'edit';
  templateName?: string;
  connectedAccounts: WhatsAppAccountDto[];
  selectedAccountId?: string;
  onSelectedAccountIdChange?: (accountId: string) => void;
};

export function TemplateFormPageHeader({
  mode,
  templateName,
  connectedAccounts,
  selectedAccountId,
  onSelectedAccountIdChange,
}: TemplateFormPageHeaderProps) {
  const selected =
    connectedAccounts.find((account) => account.id === selectedAccountId) ??
    connectedAccounts[0];

  const isCreate = mode === 'create';

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" asChild>
              <Link to="/templates" aria-label="Back to templates">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <div className="min-w-0 space-y-1">
                <h2 className="text-base font-semibold text-foreground">
                  {isCreate ? 'Create template' : `Edit ${templateName ?? 'template'}`}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isCreate
                    ? 'Compose your message and submit to Meta for approval.'
                    : 'Update content and resubmit to Meta for approval.'}
                </p>
              </div>
            </div>
          </div>

          {selected && connectedAccounts.length > 0 ? (
            <div className="w-full space-y-1.5 lg:max-w-xs">
              <Label className="text-xs font-medium text-muted-foreground">Submitting via</Label>
              {connectedAccounts.length === 1 ? (
                <p className="rounded-lg border bg-muted/30 px-3 py-2 text-sm font-medium text-foreground">
                  {formatWhatsAppAccountLabel(selected)}
                </p>
              ) : (
                <Select
                  value={selected.id}
                  onValueChange={(value) => onSelectedAccountIdChange?.(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select WABA" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectedAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {formatWhatsAppAccountLabel(account)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
