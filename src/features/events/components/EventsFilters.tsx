import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EVENT_INGEST_STATUSES, type EventIngestStatus } from '@/features/events/types';

type EventsFiltersProps = {
  eventKey: string;
  status: EventIngestStatus | undefined;
  onEventKeyChange: (value: string) => void;
  onStatusChange: (value: EventIngestStatus | undefined) => void;
};

export function EventsFilters({
  eventKey,
  status,
  onEventKeyChange,
  onStatusChange,
}: EventsFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="event-key" className="text-xs font-medium text-muted-foreground">
          Event key
        </Label>
        <Input
          id="event-key"
          placeholder="order.shipped"
          className="h-9"
          value={eventKey}
          onChange={(event) => onEventKeyChange(event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">Status</Label>
        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            onStatusChange(value === 'all' ? undefined : (value as EventIngestStatus))
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {EVENT_INGEST_STATUSES.map((item) => (
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
