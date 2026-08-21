import { useNavigate } from 'react-router-dom';
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
  getWhatsAppStatusLabel,
  getWhatsAppStatusTone,
} from '@/features/platform-admin/components/platform-ui';
import { formatDate } from '@/lib/format';
import type { PlatformWhatsAppAccount } from '@/features/platform-admin/types';

type WhatsAppAccountsTableProps = {
  organizationId: string;
  items: PlatformWhatsAppAccount[];
  onEditName: (account: PlatformWhatsAppAccount) => void;
  onDelete: (account: PlatformWhatsAppAccount) => void;
};

export function WhatsAppAccountsTable({
  organizationId,
  items,
  onEditName,
  onDelete,
}: WhatsAppAccountsTableProps) {
  const navigate = useNavigate();
  const detailPath = (accountId: string) =>
    `/platform/organizations/${organizationId}/whatsapp-accounts/${accountId}`;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-5">Account</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden md:table-cell text-right">Phones</TableHead>
          <TableHead className="hidden lg:table-cell">Updated</TableHead>
          <TableHead className="w-12 pr-4 text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((account) => {
          const displayName = account.name?.trim() || 'Untitled';
          return (
            <TableRow
              key={account.id}
              className="group cursor-pointer"
              onClick={() => navigate(detailPath(account.id))}
            >
              <TableCell className="pl-5">
                <div className="flex min-w-0 items-center gap-3">
                  <PlatformInitials name={displayName} />
                  <div className="min-w-0">
                    <p className="truncate font-medium tracking-tight">
                      {account.name?.trim() || (
                        <span className="text-muted-foreground">Untitled</span>
                      )}
                    </p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      {account.metaWabaId}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1.5 sm:hidden">
                      <PlatformStatusPill
                        tone={getWhatsAppStatusTone(account.status)}
                        label={getWhatsAppStatusLabel(account.status)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {account.phoneNumberCount} phone
                        {account.phoneNumberCount === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <PlatformStatusPill
                  tone={getWhatsAppStatusTone(account.status)}
                  label={getWhatsAppStatusLabel(account.status)}
                />
              </TableCell>
              <TableCell className="hidden md:table-cell text-right tabular-nums text-muted-foreground">
                {account.phoneNumberCount}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {formatDate(account.updatedAt)}
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
                        aria-label={`Actions for ${displayName}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(detailPath(account.id))}>
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditName(account)}>
                        Edit name
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(account)}
                      >
                        Remove account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
