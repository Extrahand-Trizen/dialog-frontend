import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type NotificationRulesFiltersProps = {
  eventKey: string;
  enabled: 'true' | 'false' | undefined;
  onEventKeyChange: (value: string) => void;
  onEnabledChange: (value: 'true' | 'false' | undefined) => void;
};

export function NotificationRulesFilters({
  eventKey,
  enabled,
  onEventKeyChange,
  onEnabledChange,
}: NotificationRulesFiltersProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="rule-event-key">Event key</Label>
        <Input
          id="rule-event-key"
          placeholder="order.shipped"
          value={eventKey}
          onChange={(event) => onEventKeyChange(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={enabled ?? 'all'}
          onValueChange={(value) =>
            onEnabledChange(value === 'all' ? undefined : (value as 'true' | 'false'))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All rules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All rules</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
            <SelectItem value="false">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
