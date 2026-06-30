import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { NotificationRuleDto } from '@/features/notification-rules/types';

type NotificationRulesTableProps = {
  items: NotificationRuleDto[];
  canManage: boolean;
  onEdit: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
};

export const NotificationRulesTable = memo(function NotificationRulesTable({
  items,
  canManage,
  onEdit,
  onDelete,
}: NotificationRulesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Event key</TableHead>
          <TableHead>Template</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          {canManage ? <TableHead className="w-32" /> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell className="font-medium">{rule.name}</TableCell>
            <TableCell className="font-mono text-xs">{rule.eventKey}</TableCell>
            <TableCell>{rule.template.metaTemplateName}</TableCell>
            <TableCell>{rule.priority}</TableCell>
            <TableCell>
              <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                {rule.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </TableCell>
            <TableCell>{formatDateTime(rule.updatedAt)}</TableCell>
            {canManage ? (
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(rule.id)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(rule.id)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
