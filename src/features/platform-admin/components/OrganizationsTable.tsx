import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PlatformInitials,
  PlatformStatusPill,
} from '@/features/platform-admin/components/platform-ui';
import { formatDate } from '@/lib/format';
import type { OrganizationSummary } from '@/features/platform-admin/types';

type OrganizationsTableProps = {
  items: OrganizationSummary[];
  onToggleStatus: (organization: OrganizationSummary) => void;
  togglingId?: string;
};

export function OrganizationsTable({ items, onToggleStatus, togglingId }: OrganizationsTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-5">Client</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden md:table-cell text-right">Members</TableHead>
          <TableHead className="hidden md:table-cell text-right">WhatsApp</TableHead>
          <TableHead className="hidden lg:table-cell text-right">Templates</TableHead>
          <TableHead className="hidden lg:table-cell">Created</TableHead>
          <TableHead className="w-12 pr-4 text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((org) => (
          <TableRow
            key={org.id}
            className="group cursor-pointer"
            onClick={() => navigate(`/platform/organizations/${org.id}`)}
          >
            <TableCell className="pl-5">
              <div className="flex min-w-0 items-center gap-3">
                <PlatformInitials name={org.name} />
                <div className="min-w-0">
                  <p className="truncate font-medium tracking-tight">{org.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{org.slug}</p>
                  <div className="pt-1.5 sm:hidden">
                    <PlatformStatusPill active={org.isActive} />
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <PlatformStatusPill active={org.isActive} />
            </TableCell>
            <TableCell className="hidden md:table-cell text-right tabular-nums text-muted-foreground">
              {org.counts.members}
            </TableCell>
            <TableCell className="hidden md:table-cell text-right tabular-nums text-muted-foreground">
              {org.counts.whatsAppAccounts}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-right tabular-nums text-muted-foreground">
              {org.counts.templates}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-muted-foreground">
              {formatDate(org.createdAt)}
            </TableCell>
            <TableCell className="pr-4 text-right" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-end gap-1">
                <ChevronRight className="hidden h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 sm:block text-muted-foreground" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={togglingId === org.id}
                      aria-label={`Actions for ${org.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/platform/organizations/${org.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={togglingId === org.id}
                      onClick={() => onToggleStatus(org)}
                    >
                      {org.isActive ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
