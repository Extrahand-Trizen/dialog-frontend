import { memo } from 'react';
import { MessageStatusPill } from '@/components/shared/MessageStatusPill';
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
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-10 text-xs font-medium text-muted-foreground">
            Recipient
          </TableHead>
          <TableHead className="h-10 text-xs font-medium text-muted-foreground">
            Template
          </TableHead>
          <TableHead className="h-10 text-xs font-medium text-muted-foreground">
            Delivery status
          </TableHead>
          <TableHead className="h-10 text-xs font-medium text-muted-foreground">
            Sent
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((message) => (
          <TableRow
            key={message.id}
            className="cursor-pointer"
            onClick={() => onSelect(message.id)}
          >
            <TableCell className="font-medium tabular-nums">{message.recipientPhone}</TableCell>
            <TableCell className="text-muted-foreground">
              {message.metaTemplateName ?? '—'}
            </TableCell>
            <TableCell>
              <MessageStatusPill status={message.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDateTime(message.sentAt ?? message.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
