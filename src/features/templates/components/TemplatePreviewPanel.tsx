import { Copy, ExternalLink, Phone, Reply } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TemplatePreviewHeaderMedia } from '@/features/templates/components/TemplatePreviewHeaderMedia';
import { TemplateCarouselCardImage } from '@/features/templates/components/TemplateCarouselCardImage';
import type { TemplateHeaderType, TemplatePreviewDto, TemplateFormat } from '@/features/templates/types';

type TemplatePreviewPanelProps = {
  templateKind?: TemplateFormat;
  headerType: TemplateHeaderType | TemplatePreviewDto['headerType'];
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons?: TemplatePreviewDto['buttons'];
  mediaPreviewUrl?: string;
  headerMediaUrl?: string;
  carouselCards?: TemplatePreviewDto['carouselCards'];
};
export function TemplatePreviewPanel({
  templateKind = 'standard',
  headerType,
  headerText,
  bodyText,
  footerText,
  buttons = [],
  mediaPreviewUrl,
  headerMediaUrl,
  carouselCards = [],
}: TemplatePreviewPanelProps) {
  const resolvedHeaderType = headerType === 'none' ? 'none' : headerType;
  const isCarousel = templateKind === 'carousel';

  return (
    <Card className="border-dashed bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Preview Template</CardTitle>
        <CardDescription>Approximate layout on WhatsApp</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="mx-auto max-w-sm rounded-lg border bg-[#e5ddd5] shadow-sm"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(0,0,0,0.03) 0 2px, transparent 2px 100%)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="m-3 min-w-0 rounded-lg bg-background shadow-sm">
            {!isCarousel ? (
              <>
                {resolvedHeaderType === 'image' ||
                resolvedHeaderType === 'video' ||
                resolvedHeaderType === 'document' ? (
                  <TemplatePreviewHeaderMedia
                    headerType={resolvedHeaderType}
                    mediaUrl={mediaPreviewUrl ?? headerMediaUrl}
                    variant="full"
                  />
                ) : null}
                <div className="p-4">
                  {resolvedHeaderType === 'text' && headerText?.trim() ? (
                    <p className="mb-2 break-words text-sm font-semibold [overflow-wrap:anywhere]">
                      {headerText}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap break-words text-sm [overflow-wrap:anywhere]">
                    {bodyText || 'Body text…'}
                  </p>
                  {footerText?.trim() ? (
                    <p className="mt-3 break-words text-xs text-muted-foreground [overflow-wrap:anywhere]">
                      {footerText}
                    </p>
                  ) : null}
                  <p className="mt-2 text-right text-[10px] text-muted-foreground">12:30 PM</p>
                </div>
                {buttons.length > 0 ? (
                  <div className="border-t">
                    {buttons.map((button, index) => (
                      <PreviewButtonRow key={`${button.type}-${index}`} button={button} />
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="space-y-3 p-3">
                {bodyText?.trim() ? (
                  <p className="whitespace-pre-wrap break-words px-1 text-sm [overflow-wrap:anywhere]">
                    {bodyText}
                  </p>
                ) : null}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {carouselCards.map((card, index) => (
                    <div
                      key={`carousel-${index}`}
                      className="w-44 shrink-0 overflow-hidden rounded-md border bg-background"
                    >
                      <TemplateCarouselCardImage
                        imageMediaUrl={card.imageMediaUrl}
                        variant="full"
                      />
                      <div className="p-2">
                        <p className="break-words text-xs [overflow-wrap:anywhere]">
                          {card.bodyText}
                        </p>
                        {card.buttonText ? (
                          <p className="mt-2 truncate text-center text-[10px] font-medium text-sky-600">
                            {card.buttonText}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-right text-[10px] text-muted-foreground">12:30 PM</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewButtonRow({ button }: { button: TemplatePreviewDto['buttons'][number] }) {
  if (button.type === 'URL') {
    return (
      <div className="flex items-center justify-center gap-1.5 border-b px-3 py-2.5 text-sm font-medium text-sky-600 last:border-b-0">
        <span className="truncate">{button.text}</span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      </div>
    );
  }

  if (button.type === 'PHONE_NUMBER') {
    return (
      <div className="flex items-center justify-center gap-1.5 border-b px-3 py-2.5 text-sm font-medium text-sky-600 last:border-b-0">
        <span className="truncate">{button.text}</span>
        <Phone className="h-3.5 w-3.5 shrink-0" />
      </div>
    );
  }

  if (button.type === 'COPY_CODE') {
    return (
      <div className="flex items-center justify-center gap-1.5 border-b px-3 py-2.5 text-sm font-medium text-sky-600 last:border-b-0">
        <span className="truncate">{button.text}</span>
        <Copy className="h-3.5 w-3.5 shrink-0" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1.5 border-b px-3 py-2.5 text-sm font-medium text-sky-600 last:border-b-0">
      <span className="truncate">{button.text}</span>
      <Reply className="h-3.5 w-3.5 shrink-0" />
    </div>
  );
}
