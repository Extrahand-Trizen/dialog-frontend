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
import type { ApiKeySummaryDto } from '@/features/api-keys/types';

type ApiKeysTableProps = {
  items: ApiKeySummaryDto[];
  canManage: boolean;
  onRevoke: (apiKeyId: string) => void;
};

function KeyStatusBadge({ apiKey }: { apiKey: ApiKeySummaryDto }) {
  if (apiKey.revokedAt) {
    return <Badge variant="destructive">Revoked</Badge>;
  }
  if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
    return <Badge variant="secondary">Expired</Badge>;
  }
  return <Badge variant="default">Active</Badge>;
}

export const ApiKeysTable = memo(function ApiKeysTable({
  items,
  canManage,
  onRevoke,
}: ApiKeysTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Prefix</TableHead>
          <TableHead>Scopes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last used</TableHead>
          <TableHead>Created</TableHead>
          {canManage ? <TableHead className="w-24" /> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((apiKey) => (
          <TableRow key={apiKey.id}>
            <TableCell className="font-medium">{apiKey.name}</TableCell>
            <TableCell className="font-mono text-xs">{apiKey.keyPrefix}…</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {apiKey.scopes.map((scope) => (
                  <Badge key={scope} variant="outline" className="text-xs">
                    {scope}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <KeyStatusBadge apiKey={apiKey} />
            </TableCell>
            <TableCell>{formatDateTime(apiKey.lastUsedAt)}</TableCell>
            <TableCell>{formatDateTime(apiKey.createdAt)}</TableCell>
            {canManage ? (
              <TableCell>
                {!apiKey.revokedAt ? (
                  <Button variant="ghost" size="sm" onClick={() => onRevoke(apiKey.id)}>
                    Revoke
                  </Button>
                ) : null}
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
