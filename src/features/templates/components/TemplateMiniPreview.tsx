import type { TemplateSummaryPreviewDto } from '@/features/templates/types';
import { TemplatePreviewHeaderMedia } from '@/features/templates/components/TemplatePreviewHeaderMedia';
import { getTemplatePreviewPlaceholderImage } from '@/features/templates/utils/previewPlaceholders';

type TemplateMiniPreviewProps = {
  headerType: TemplateSummaryPreviewDto['headerType'];
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons?: TemplateSummaryPreviewDto['buttons'];
  templateKind?: TemplateSummaryPreviewDto['templateKind'];
  carouselCards?: TemplateSummaryPreviewDto['carouselCards'];
  placeholderSeed?: string | number;
};

export function TemplateMiniPreview({
  headerType,
  headerText,
  bodyText,
  footerText,
  buttons = [],
  templateKind = 'standard',
  carouselCards = [],
  placeholderSeed = 0,
}: TemplateMiniPreviewProps) {
  const isCarousel = templateKind === 'carousel';

  return (
    <div className="overflow-hidden rounded-md border bg-[#e5ddd5] p-2">
      <div className="overflow-hidden rounded bg-background text-xs shadow-sm">
        {!isCarousel ? (
          <>
            {headerType === 'image' || headerType === 'video' || headerType === 'document' ? (
              <TemplatePreviewHeaderMedia
                headerType={headerType}
                placeholderSeed={placeholderSeed}
                variant="mini"
              />
            ) : null}
            <div className="p-3">
              {headerType === 'text' && headerText?.trim() ? (
                <p className="mb-1 line-clamp-1 font-semibold">{headerText}</p>
              ) : null}
              <p className="line-clamp-4 whitespace-pre-wrap text-muted-foreground">{bodyText}</p>
              {footerText?.trim() ? (
                <p className="mt-2 line-clamp-1 text-[10px] text-muted-foreground">{footerText}</p>
              ) : null}
            </div>
          </>
        ) : (
          <div className="space-y-2 p-2">
            <p className="line-clamp-2 whitespace-pre-wrap text-muted-foreground">{bodyText}</p>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {(carouselCards.length > 0 ? carouselCards : [{ headerType: 'image' as const, bodyText: '' }, { headerType: 'image' as const, bodyText: '' }]).map(
                (card, index) => (
                  <div
                    key={`mini-carousel-${index}`}
                    className="w-24 shrink-0 overflow-hidden rounded border bg-background"
                  >
                    <img
                      src={getTemplatePreviewPlaceholderImage(`${placeholderSeed}-card-${index}`)}
                      alt=""
                      className="h-12 w-full object-cover"
                    />
                    <p className="line-clamp-2 p-1.5 text-[9px] text-muted-foreground">
                      {card.bodyText || 'Card body…'}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
        {buttons.length > 0 ? (
          <div className="border-t">
            {buttons.slice(0, 3).map((button, index) => (
              <div
                key={`${button.type}-${index}`}
                className="truncate border-b px-2 py-1.5 text-center text-[10px] font-medium text-sky-600 last:border-b-0"
              >
                {button.text}
              </div>
            ))}
            {buttons.length > 3 ? (
              <div className="px-2 py-1 text-center text-[10px] text-muted-foreground">
                +{buttons.length - 3} more
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
