import { useState } from 'react';
import { cn } from '@/lib/utils';

type TemplateCarouselCardImageProps = {
  imageMediaUrl?: string;
  className?: string;
  variant?: 'thumb' | 'full';
};

export function TemplateCarouselCardImage({
  imageMediaUrl,
  className,
  variant = 'thumb',
}: TemplateCarouselCardImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = imageMediaUrl?.trim();

  if (!src || imageFailed) {
    return null;
  }

  return (
    <img
      src={src}
      alt=""
      className={cn(
        variant === 'full' ? 'block h-auto w-full' : 'h-12 w-full object-cover',
        className,
      )}
      onError={() => setImageFailed(true)}
    />
  );
}
