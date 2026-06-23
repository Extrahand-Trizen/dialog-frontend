/**
 * Local placeholder images for template UI previews.
 * Meta resumable-upload handles are opaque and cannot be rendered in the browser.
 */
const PLACEHOLDER_IMAGES = [
  '/placeholders/template-media-1.svg',
  '/placeholders/template-media-2.svg',
  '/placeholders/template-media-3.svg',
] as const;

const FESTIVE_PLACEHOLDER = '/placeholders/template-media-festive.svg';

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getTemplatePreviewPlaceholderImage(seed: string | number = 0): string {
  const seedText = String(seed).toLowerCase();

  if (seedText.includes('festive') || seedText.includes('promo') || seedText.includes('sale')) {
    return FESTIVE_PLACEHOLDER;
  }

  const index = hashSeed(seedText) % PLACEHOLDER_IMAGES.length;
  return PLACEHOLDER_IMAGES[index];
}
