import { memo } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDateTime } from '@/lib/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { EventIngestDto } from '@/features/events/types';

type EventsTableProps = {
  items: EventIngestDto[];
};

export const EventsTable = memo(function EventsTable({ items }: EventsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event key</TableHead>
          <TableHead>Recipient</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Received</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.eventKey}</TableCell>
            <TableCell>{event.recipientPhone}</TableCell>
            <TableCell>
              <StatusBadge status={event.status} />
            </TableCell>
            <TableCell>{formatDateTime(event.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
