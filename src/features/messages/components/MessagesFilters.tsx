import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { messageStatusLabel } from '@/components/shared/MessageStatusPill';
import { MESSAGE_STATUSES, type MessageListStatus } from '@/features/messages/types';

type MessagesFiltersProps = {
  recipientPhone: string;
  metaTemplateName: string;
  status: MessageListStatus | undefined;
  onRecipientPhoneChange: (value: string) => void;
  onMetaTemplateNameChange: (value: string) => void;
  onStatusChange: (value: MessageListStatus | undefined) => void;
};

export function MessagesFilters({
  recipientPhone,
  metaTemplateName,
  status,
  onRecipientPhoneChange,
  onMetaTemplateNameChange,
  onStatusChange,
}: MessagesFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="recipient-phone" className="text-xs font-medium text-muted-foreground">
          Recipient phone
        </Label>
        <Input
          id="recipient-phone"
          placeholder="+91…"
          className="h-9"
          value={recipientPhone}
          onChange={(event) => onRecipientPhoneChange(event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="template-name" className="text-xs font-medium text-muted-foreground">
          Template name
        </Label>
        <Input
          id="template-name"
          placeholder="order_update"
          className="h-9"
          value={metaTemplateName}
          onChange={(event) => onMetaTemplateNameChange(event.target.value)}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2 xl:col-span-1">
        <Label className="text-xs font-medium text-muted-foreground">Delivery status</Label>
        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            onStatusChange(value === 'all' ? undefined : (value as MessageListStatus))
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {MESSAGE_STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {messageStatusLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
