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
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="rule-event-key" className="text-xs font-medium text-muted-foreground">
          Event key
        </Label>
        <Input
          id="rule-event-key"
          placeholder="order.shipped"
          className="h-9"
          value={eventKey}
          onChange={(event) => onEventKeyChange(event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">Status</Label>
        <Select
          value={enabled ?? 'all'}
          onValueChange={(value) =>
            onEnabledChange(value === 'all' ? undefined : (value as 'true' | 'false'))
          }
        >
          <SelectTrigger className="h-9">
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
