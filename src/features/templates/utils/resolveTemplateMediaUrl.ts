import { getApiBaseUrl } from '@/config/runtime-config';

/** MinIO public URL for template preview images — used directly in `<img src>`. */
export function resolveTemplateMediaUrl(url?: string): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) {
    return undefined;
  }

  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  // Legacy API proxy paths — prefer MinIO URLs from the API; keep as fallback only.
  if (trimmed.startsWith('/media/')) {
    const base = getApiBaseUrl().replace(/\/+$/, '');
    return `${base}${trimmed}`;
  }

  return trimmed;
}

export function getTemplateHeaderPreviewUrl(input: {
  headerMediaUrl?: string;
  headerMediaHandle?: string;
}): string | undefined {
  return (
    resolveTemplateMediaUrl(input.headerMediaUrl) ??
    (input.headerMediaHandle?.trim().startsWith('http')
      ? input.headerMediaHandle.trim()
      : undefined)
  );
}

export function getTemplateCarouselPreviewUrl(input: {
  imageMediaUrl?: string;
  imageHandle?: string;
}): string | undefined {
  return (
    resolveTemplateMediaUrl(input.imageMediaUrl) ??
    (input.imageHandle?.trim().startsWith('http') ? input.imageHandle.trim() : undefined)
  );
}
