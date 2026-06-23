import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
      <div className="space-y-2">
        <Label htmlFor="recipient-phone">Recipient phone</Label>
        <Input
          id="recipient-phone"
          placeholder="+91…"
          value={recipientPhone}
          onChange={(event) => onRecipientPhoneChange(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="template-name">Template name</Label>
        <Input
          id="template-name"
          placeholder="order_update"
          value={metaTemplateName}
          onChange={(event) => onMetaTemplateNameChange(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            onStatusChange(value === 'all' ? undefined : (value as MessageListStatus))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {MESSAGE_STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
