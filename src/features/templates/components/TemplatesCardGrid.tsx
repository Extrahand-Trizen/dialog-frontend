import { memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatDateTime } from '@/lib/format';
import type { TemplateSummaryDto } from '@/features/templates/types';
import { TemplateMiniPreview } from '@/features/templates/components/TemplateMiniPreview';
import { TemplateStatusBadge } from '@/features/templates/components/TemplateStatusBadge';

type TemplateCardProps = {
  template: TemplateSummaryDto;
  onSelect: (templateId: string) => void;
};

export const TemplateCard = memo(function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const preview = template.preview;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/80 transition-all hover:border-border hover:shadow-md"
      onClick={() => onSelect(template.id)}
    >
      <CardHeader className="space-y-1 p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{template.metaTemplateName}</p>
            <p className="text-[11px] text-muted-foreground">
              {template.category} · {template.language.toUpperCase()}
            </p>
          </div>
          <TemplateStatusBadge status={template.metaStatus} />
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-2 pt-0">
        <TemplateMiniPreview
          compact
          headerType={preview?.headerType ?? 'none'}
          headerText={preview?.headerText}
          headerMediaUrl={preview?.headerMediaUrl}
          headerMediaHandle={preview?.headerMediaHandle}
          bodyText={preview?.bodyText ?? 'No preview available'}
          footerText={preview?.footerText}
          buttons={preview?.buttons ?? []}
          templateKind={preview?.templateKind}
          carouselCards={preview?.carouselCards}
        />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-1 border-t bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
        <span>{template.createdByName ? `By ${template.createdByName}` : 'System'}</span>
        <span>Updated {formatDateTime(template.updatedAt)}</span>
      </CardFooter>
    </Card>
  );
});

type TemplatesCardGridProps = {
  items: TemplateSummaryDto[];
  onSelect: (templateId: string) => void;
};

export const TemplatesCardGrid = memo(function TemplatesCardGrid({
  items,
  onSelect,
}: TemplatesCardGridProps) {
  return (
    <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((template) => (
        <TemplateCard key={template.id} template={template} onSelect={onSelect} />
      ))}
    </div>
  );
});
