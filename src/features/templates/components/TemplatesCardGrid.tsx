import { memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDateTime } from '@/lib/format';
import type { TemplateSummaryDto } from '@/features/templates/types';
import { TemplateMiniPreview } from '@/features/templates/components/TemplateMiniPreview';

type TemplateCardProps = {
  template: TemplateSummaryDto;
  onSelect: (templateId: string) => void;
};

export const TemplateCard = memo(function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const preview = template.preview;

  return (
    <Card
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
      onClick={() => onSelect(template.id)}
    >
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-medium">{template.metaTemplateName}</p>
            <p className="text-xs text-muted-foreground">
              {template.category} · {template.language.toUpperCase()}
            </p>
          </div>
          <StatusBadge status={template.metaStatus} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <TemplateMiniPreview
          headerType={preview?.headerType ?? 'none'}
          headerText={preview?.headerText}
          bodyText={preview?.bodyText ?? 'No preview available'}
          footerText={preview?.footerText}
          buttons={preview?.buttons ?? []}
          templateKind={preview?.templateKind}
          carouselCards={preview?.carouselCards}
          placeholderSeed={template.metaTemplateName || template.id}
        />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
        <span>{template.createdByName ? `By ${template.createdByName}` : 'Synced from Meta'}</span>
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((template) => (
        <TemplateCard key={template.id} template={template} onSelect={onSelect} />
      ))}
    </div>
  );
});
