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
import type { MessageSummaryDto } from '@/features/messages/types';

type MessagesTableProps = {
  items: MessageSummaryDto[];
  onSelect: (messageId: string) => void;
};

export const MessagesTable = memo(function MessagesTable({
  items,
  onSelect,
}: MessagesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Recipient</TableHead>
          <TableHead>Template</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((message) => (
          <TableRow
            key={message.id}
            className="cursor-pointer"
            onClick={() => onSelect(message.id)}
          >
            <TableCell>{message.recipientPhone}</TableCell>
            <TableCell>{message.metaTemplateName ?? '—'}</TableCell>
            <TableCell>
              <StatusBadge status={message.status} />
            </TableCell>
            <TableCell>{formatDateTime(message.sentAt ?? message.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
