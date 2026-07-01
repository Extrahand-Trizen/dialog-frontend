import { useEffect, useState } from 'react';
import { FileText, Play } from 'lucide-react';
import { resolveTemplateMediaUrl } from '@/features/templates/utils/resolveTemplateMediaUrl';
import { cn } from '@/lib/utils';

type TemplatePreviewHeaderMediaProps = {
  headerType: 'image' | 'video' | 'document';
  /** MinIO URL (or local blob while drafting a new template). */
  mediaUrl?: string;
  variant?: 'mini' | 'full';
  className?: string;
};

const VARIANT_CLASS: Record<NonNullable<TemplatePreviewHeaderMediaProps['variant']>, string> = {
  mini: 'max-h-20 w-full object-cover',
  full: 'block h-auto w-full',
};

export function TemplatePreviewHeaderMedia({
  headerType,
  mediaUrl,
  variant = 'full',
  className,
}: TemplatePreviewHeaderMediaProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const resolvedMediaUrl = resolveTemplateMediaUrl(mediaUrl);
  const imageClass = cn(VARIANT_CLASS[variant], className);

  useEffect(() => {
    setImageFailed(false);
  }, [resolvedMediaUrl]);

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

  if (!resolvedMediaUrl || imageFailed) {
    return null;
  }

  if (headerType === 'video') {
    if (resolvedMediaUrl.startsWith('blob:') || resolvedMediaUrl.startsWith('data:')) {
      return <video src={resolvedMediaUrl} className={imageClass} muted />;
    }

    return (
      <div className="relative">
        <img
          key={resolvedMediaUrl}
          src={resolvedMediaUrl}
          alt=""
          className={imageClass}
          onError={() => setImageFailed(true)}
        />
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

  return (
    <img
      key={resolvedMediaUrl}
      src={resolvedMediaUrl}
      alt=""
      className={imageClass}
      onError={() => setImageFailed(true)}
    />
  );
}
