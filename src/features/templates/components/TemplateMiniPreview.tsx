import type { TemplateSummaryPreviewDto } from '@/features/templates/types';
import { TemplatePreviewHeaderMedia } from '@/features/templates/components/TemplatePreviewHeaderMedia';
import { TemplateCarouselCardImage } from '@/features/templates/components/TemplateCarouselCardImage';

type TemplateMiniPreviewProps = {
  headerType: TemplateSummaryPreviewDto['headerType'];
  headerText?: string;
  headerMediaUrl?: string;
  bodyText: string;
  footerText?: string;
  buttons?: TemplateSummaryPreviewDto['buttons'];
  templateKind?: TemplateSummaryPreviewDto['templateKind'];
  carouselCards?: TemplateSummaryPreviewDto['carouselCards'];
  /** Tighter layout for template list cards — still shows full content. */
  compact?: boolean;
};

export function TemplateMiniPreview({
  headerType,
  headerText,
  headerMediaUrl,
  bodyText,
  footerText,
  buttons = [],
  templateKind = 'standard',
  carouselCards = [],
  compact = false,
}: TemplateMiniPreviewProps) {
  const isCarousel = templateKind === 'carousel';

  return (
    <div
      className={
        compact
          ? 'w-full overflow-hidden rounded-md border bg-[#e5ddd5] p-1'
          : 'overflow-hidden rounded-md border bg-[#e5ddd5] p-2'
      }
    >
      <div
        className={
          compact
            ? 'overflow-hidden rounded bg-background text-[10px] leading-snug shadow-sm'
            : 'overflow-hidden rounded bg-background text-xs shadow-sm'
        }
      >
        {!isCarousel ? (
          <>
            {headerType === 'image' || headerType === 'video' || headerType === 'document' ? (
              <TemplatePreviewHeaderMedia
                headerType={headerType}
                mediaUrl={headerMediaUrl}
                variant="full"
              />
            ) : null}
            <div className={compact ? 'p-2' : 'p-3'}>
              {headerType === 'text' && headerText?.trim() ? (
                <p
                  className={
                    compact
                      ? 'mb-1 break-words font-semibold [overflow-wrap:anywhere]'
                      : 'mb-2 break-words font-semibold [overflow-wrap:anywhere]'
                  }
                >
                  {headerText}
                </p>
              ) : null}
              <p className="whitespace-pre-wrap break-words text-muted-foreground [overflow-wrap:anywhere]">
                {bodyText}
              </p>
              {footerText?.trim() ? (
                <p
                  className={
                    compact
                      ? 'mt-1 break-words text-[9px] text-muted-foreground [overflow-wrap:anywhere]'
                      : 'mt-2 break-words text-[10px] text-muted-foreground [overflow-wrap:anywhere]'
                  }
                >
                  {footerText}
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <div className={compact ? 'space-y-1.5 p-1.5' : 'space-y-2 p-2'}>
            <p className="whitespace-pre-wrap break-words text-muted-foreground [overflow-wrap:anywhere]">
              {bodyText}
            </p>
            {carouselCards.length > 0 ? (
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {carouselCards.map((card, index) => (
                  <div
                    key={`mini-carousel-${index}`}
                    className={
                      compact
                        ? 'w-24 shrink-0 overflow-hidden rounded border bg-background'
                        : 'w-36 shrink-0 overflow-hidden rounded border bg-background sm:w-44'
                    }
                  >
                    <TemplateCarouselCardImage
                      imageMediaUrl={card.imageMediaUrl}
                      variant="full"
                    />
                    <p
                      className={
                        compact
                          ? 'break-words p-1.5 text-[9px] text-muted-foreground [overflow-wrap:anywhere]'
                          : 'break-words p-2 text-[10px] text-muted-foreground [overflow-wrap:anywhere]'
                      }
                    >
                      {card.bodyText || 'Card body…'}
                    </p>
                    {card.buttonText ? (
                      <p
                        className={
                          compact
                            ? 'border-t px-1.5 py-1 text-center text-[9px] font-medium text-sky-600'
                            : 'border-t px-2 py-1.5 text-center text-[10px] font-medium text-sky-600'
                        }
                      >
                        {card.buttonText}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
        {buttons.length > 0 ? (
          <div className="border-t">
            {buttons.map((button, index) => (
              <div
                key={`${button.type}-${index}`}
                className={
                  compact
                    ? 'break-words border-b px-1.5 py-1 text-center text-[9px] font-medium text-sky-600 last:border-b-0 [overflow-wrap:anywhere]'
                    : 'break-words border-b px-2 py-1.5 text-center text-[10px] font-medium text-sky-600 last:border-b-0 [overflow-wrap:anywhere]'
                }
              >
                {button.text}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
