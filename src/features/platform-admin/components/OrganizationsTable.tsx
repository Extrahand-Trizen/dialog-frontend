import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import type { OrganizationSummary } from '@/features/platform-admin/types';

type OrganizationsTableProps = {
  items: OrganizationSummary[];
  onToggleStatus: (organization: OrganizationSummary) => void;
  togglingId?: string;
};

export function OrganizationsTable({ items, onToggleStatus, togglingId }: OrganizationsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>WhatsApp accounts</TableHead>
          <TableHead>Templates</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{org.slug}</TableCell>
            <TableCell>
              <Badge variant={org.isActive ? 'default' : 'secondary'}>
                {org.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>{org.counts.members}</TableCell>
            <TableCell>{org.counts.whatsAppAccounts}</TableCell>
            <TableCell>{org.counts.templates}</TableCell>
            <TableCell className="text-muted-foreground">{formatDate(org.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                disabled={togglingId === org.id}
                onClick={() => onToggleStatus(org)}
              >
                {org.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
