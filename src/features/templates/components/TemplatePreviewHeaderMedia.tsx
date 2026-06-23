import { useState } from 'react';
import { FileText, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTemplatePreviewPlaceholderImage } from '@/features/templates/utils/previewPlaceholders';

type TemplatePreviewHeaderMediaProps = {
  headerType: 'image' | 'video' | 'document';
  mediaUrl?: string;
  /** Stable seed when falling back to a dummy image (e.g. template id or card index). */
  placeholderSeed?: string | number;
  variant?: 'mini' | 'full';
  className?: string;
};

const VARIANT_CLASS: Record<NonNullable<TemplatePreviewHeaderMediaProps['variant']>, string> = {
  mini: 'max-h-20 w-full object-cover',
  full: 'max-h-36 w-full object-cover',
};

export function TemplatePreviewHeaderMedia({
  headerType,
  mediaUrl,
  placeholderSeed = 0,
  variant = 'full',
  className,
}: TemplatePreviewHeaderMediaProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (headerType === 'document') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 border-b bg-muted/40 px-3 text-muted-foreground',
          variant === 'mini' ? 'py-2 text-[10px]' : 'px-4 py-3 text-sm',
          className,
        )}
      >
        <FileText className={cn('shrink-0', variant === 'mini' ? 'h-3 w-3' : 'h-4 w-4')} />
        <span className="truncate">Document attachment</span>
      </div>
    );
  }

  const imageSrc = mediaUrl ?? getTemplatePreviewPlaceholderImage(placeholderSeed);
  const imageClass = cn(VARIANT_CLASS[variant], className);

  if (headerType === 'video') {
    if (mediaUrl?.startsWith('blob:') || mediaUrl?.startsWith('data:')) {
      return <video src={mediaUrl} className={imageClass} muted />;
    }

    return (
      <div className="relative">
        {!imageFailed ? (
          <img
            src={mediaUrl ?? getTemplatePreviewPlaceholderImage(`video-${placeholderSeed}`)}
            alt=""
            className={imageClass}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <MediaFallback variant={variant} label="Video" />
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <div
            className={cn(
              'rounded-full bg-black/50',
              variant === 'mini' ? 'p-1' : 'p-2',
            )}
          >
            <Play
              className={cn(
                'text-white fill-white',
                variant === 'mini' ? 'h-3 w-3' : 'h-5 w-5',
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  if (imageFailed) {
    return <MediaFallback variant={variant} label="Image" />;
  }

  return (
    <img
      src={imageSrc}
      alt=""
      className={imageClass}
      onError={() => setImageFailed(true)}
    />
  );
}

function MediaFallback({
  variant,
  label,
}: {
  variant: 'mini' | 'full';
  label: string;
}) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center rounded bg-muted text-muted-foreground',
        variant === 'mini' ? 'mb-2 h-10 text-[10px]' : 'h-36 text-xs',
      )}
    >
      {label}
    </div>
  );
}
