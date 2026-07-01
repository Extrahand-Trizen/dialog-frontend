import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineError } from '@/components/shared/InlineError';
import { TemplateStatusBadge } from '@/features/templates/components/TemplateStatusBadge';
import { formatDateTime } from '@/lib/format';
import { TemplatePreviewPanel } from '@/features/templates/components/TemplatePreviewPanel';
import type { TemplateDetailDto } from '@/features/templates/types';
import { canEditTemplate } from '@/features/templates/utils/templateEditability';

type TemplateDetailDialogProps = {
  templateId: string | null;
  data: TemplateDetailDto | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  canManageTemplates: boolean;
  onClose: () => void;
  onEdit?: (templateId: string) => void;
};

export function TemplateDetailDialog({
  templateId,
  data,
  isLoading,
  isError,
  error,
  canManageTemplates,
  onClose,
  onEdit,
}: TemplateDetailDialogProps) {
  const showEdit =
    canManageTemplates &&
    data &&
    canEditTemplate(data.metaStatus, data.metaTemplateId) &&
    onEdit;

  return (
    <Dialog open={!!templateId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{data?.metaTemplateName ?? 'Template details'}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Skeleton className="h-56" />
        ) : isError ? (
          <InlineError error={error} />
        ) : data ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <TemplateStatusBadge status={data.metaStatus} />
              <span className="rounded-md bg-muted px-2 py-1 text-xs">{data.category}</span>
              <span className="rounded-md bg-muted px-2 py-1 text-xs">{data.language}</span>
            </div>

            {data.preview ? (
              <TemplatePreviewPanel
                templateKind={data.preview.templateKind}
                headerType={data.preview.headerType}
                headerText={data.preview.headerText}
                headerMediaUrl={data.preview.headerMediaUrl}
                headerMediaHandle={data.preview.headerMediaHandle}
                bodyText={data.preview.bodyText}
                footerText={data.preview.footerText}
                buttons={data.preview.buttons}
                carouselCards={data.preview.carouselCards}
              />
            ) : null}

            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Meta template ID</dt>
                <dd className="font-mono text-xs">{data.metaTemplateId ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Current version</dt>
                <dd>{data.currentVersion ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created by</dt>
                <dd>{data.createdByName ?? 'System'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Last updated</dt>
                <dd>{formatDateTime(data.updatedAt)}</dd>
              </div>
            </dl>

            {data.currentVersionDetail?.rejectionReason ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {data.currentVersionDetail.rejectionReason}
              </p>
            ) : null}

            {data.currentVersionDetail?.components ? (
              <details className="rounded-md bg-muted p-3 text-xs">
                <summary className="cursor-pointer font-medium">Developer details</summary>
                <pre className="mt-2 max-h-48 overflow-auto">
                  {JSON.stringify(data.currentVersionDetail.components, null, 2)}
                </pre>
              </details>
            ) : null}

            {showEdit ? (
              <DialogFooter className="sm:justify-start">
                <Button type="button" onClick={() => onEdit(data.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit template
                </Button>
              </DialogFooter>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
