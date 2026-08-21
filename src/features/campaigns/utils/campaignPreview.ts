import { substituteVariableSamples } from '@/features/templates/utils/templateVariables';
import type { TemplateButtonPreview, TemplateSummaryPreviewDto } from '@/features/templates/types';

/** Map form variable values onto both named and numeric {{n}} placeholders. */
export function buildCampaignPreviewSamples(
  variableSchema: unknown,
  variables: Record<string, string>,
  buttonUrlSuffix?: string,
): Record<string, string> {
  const samples: Record<string, string> = { ...variables };

  if (variableSchema && typeof variableSchema === 'object' && !Array.isArray(variableSchema)) {
    const list = (variableSchema as { variables?: unknown }).variables;
    if (Array.isArray(list)) {
      for (const entry of list) {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
        const row = entry as { index?: unknown; name?: unknown };
        const index = Number(row.index);
        if (!Number.isFinite(index)) continue;
        const name = typeof row.name === 'string' && row.name.length > 0 ? row.name : undefined;
        const key = name ?? String(index);
        const value = variables[key]?.trim() ?? variables[String(index)]?.trim() ?? '';
        samples[String(index)] = value;
        if (name) samples[name] = value;
      }
    }
  }

  const suffix = buttonUrlSuffix?.trim() ?? '';
  if (suffix) {
    samples.taskId = suffix;
  }

  return samples;
}

export function applyCampaignPreviewSamples(
  preview: TemplateSummaryPreviewDto,
  samples: Record<string, string>,
  buttonUrlSuffix?: string,
): TemplateSummaryPreviewDto {
  const suffix = buttonUrlSuffix?.trim() ?? '';

  const buttons: TemplateButtonPreview[] = (preview.buttons ?? []).map((button) => {
    if (button.type !== 'URL') return button;
    let url = substituteVariableSamples(button.url, samples);
    // Dynamic URL suffix often remains as a trailing {{n}} after named body vars are filled.
    if (suffix && /\{\{\d+\}\}/.test(url)) {
      url = url.replace(/\{\{\d+\}\}/g, suffix);
    }
    return { ...button, url };
  });

  return {
    ...preview,
    headerText: preview.headerText
      ? substituteVariableSamples(preview.headerText, samples)
      : preview.headerText,
    bodyText: substituteVariableSamples(preview.bodyText, samples),
    footerText: preview.footerText
      ? substituteVariableSamples(preview.footerText, samples)
      : preview.footerText,
    buttons,
    carouselCards: preview.carouselCards?.map((card) => ({
      ...card,
      bodyText: substituteVariableSamples(card.bodyText, samples),
    })),
  };
}
