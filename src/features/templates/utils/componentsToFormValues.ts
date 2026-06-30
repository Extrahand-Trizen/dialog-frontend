import type { TemplateCreateFormValues } from '@/features/templates/schemas';
import type { TemplateDetailDto } from '@/features/templates/types';
import { createButtonRowId, createCarouselCardId } from '@/features/templates/utils/buttonValidation';

type VariableSchema = {
  variables?: Array<{ index: number; name?: string }>;
  linkTrackingEnabled?: boolean;
};

type MetaComponent = Record<string, unknown>;

function isRecord(value: unknown): value is MetaComponent {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function buildIndexToName(variableSchema: VariableSchema | undefined): Map<number, string> {
  const map = new Map<number, string>();
  for (const variable of variableSchema?.variables ?? []) {
    map.set(variable.index, variable.name ?? String(variable.index));
  }
  return map;
}

function metaTextToNamed(text: string, indexToName: Map<number, string>): string {
  return text.replace(/\{\{(\d+)\}\}/g, (_match, index: string) => {
    const name = indexToName.get(Number.parseInt(index, 10));
    return `{{${name ?? index}}}`;
  });
}

function readExampleStrings(example: unknown): string[] {
  if (!example || typeof example !== 'object') {
    return [];
  }
  const record = example as Record<string, unknown>;
  const bodyText = record.body_text;
  if (Array.isArray(bodyText) && Array.isArray(bodyText[0])) {
    return (bodyText[0] as unknown[]).map((value) => String(value ?? ''));
  }
  const headerText = record.header_text;
  if (Array.isArray(headerText)) {
    return headerText.map((value) => String(value ?? ''));
  }
  return [];
}

function buildVariableSamples(
  variableSchema: VariableSchema | undefined,
  samples: string[],
): Record<string, string> {
  const variables = [...(variableSchema?.variables ?? [])].sort((a, b) => a.index - b.index);
  const result: Record<string, string> = {};

  variables.forEach((variable, offset) => {
    const key = variable.name ?? String(variable.index);
    const sample = samples[offset]?.trim();
    if (sample) {
      result[key] = sample;
    }
  });

  return result;
}

function splitPhoneNumber(phoneNumber: string): { countryCode: string; nationalNumber: string } {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    return { countryCode: '+91', nationalNumber: digits.slice(2) };
  }
  if (digits.length > 10) {
    return { countryCode: `+${digits.slice(0, digits.length - 10)}`, nationalNumber: digits.slice(-10) };
  }
  return { countryCode: '+91', nationalNumber: digits };
}

export function componentsToFormValues(detail: TemplateDetailDto): Partial<TemplateCreateFormValues> {
  const base: Partial<TemplateCreateFormValues> = {
    name: detail.metaTemplateName,
    language: detail.language,
    category: detail.category,
  };

  const components = detail.currentVersionDetail?.components;
  if (!Array.isArray(components)) {
    return base;
  }

  const variableSchema = detail.currentVersionDetail?.variableSchema as VariableSchema | undefined;
  const indexToName = buildIndexToName(variableSchema);

  let headerType: TemplateCreateFormValues['headerType'] = 'none';
  let headerText = '';
  let headerMediaHandle = '';
  let headerMediaUrl = '';
  let headerMediaFormat: TemplateCreateFormValues['headerMediaFormat'];
  let bodyText = '';
  let enableFooter = false;
  let footerText = '';
  let bodySamples: string[] = [];
  let headerSamples: string[] = [];

  const quickReplyButtons: TemplateCreateFormValues['quickReplyButtons'] = [];
  const urlButtons: TemplateCreateFormValues['urlButtons'] = [];
  let enableQuickReplies = false;
  let enableCallToAction = false;
  let enablePhoneButton = false;
  let phoneButtonText = '';
  let phoneCountryCode = '+91';
  let phoneNumber = '';
  let enableCopyCode = false;
  let copyCodeText = '';
  let copyCodeExample = '';
  let templateFormat: TemplateCreateFormValues['templateFormat'] = 'standard';
  const carouselCards: TemplateCreateFormValues['carouselCards'] = [];

  for (const raw of components) {
    if (!isRecord(raw) || typeof raw.type !== 'string') {
      continue;
    }

    const type = raw.type.toUpperCase();

    if (type === 'CAROUSEL' && Array.isArray(raw.cards)) {
      templateFormat = 'carousel';

      for (const cardRaw of raw.cards) {
        if (!isRecord(cardRaw) || !Array.isArray(cardRaw.components)) {
          continue;
        }

        let imageHandle = '';
        let imageMediaUrl = '';
        let cardBodyText = '';
        let enableButton = false;
        let buttonText = '';
        let buttonUrl = '';

        for (const compRaw of cardRaw.components) {
          if (!isRecord(compRaw) || typeof compRaw.type !== 'string') {
            continue;
          }

          const compType = compRaw.type.toUpperCase();
          if (compType === 'HEADER') {
            const example = compRaw.example as
              | { header_handle?: string[]; header_media_url?: string; image_media_url?: string }
              | undefined;
            const handles = example?.header_handle;
            imageHandle = handles?.[0] ?? '';
            imageMediaUrl = example?.image_media_url ?? example?.header_media_url ?? '';
          }

          if (compType === 'BODY' && typeof compRaw.text === 'string') {
            cardBodyText = compRaw.text;
          }

          if (compType === 'BUTTONS' && Array.isArray(compRaw.buttons)) {
            const buttonRaw = compRaw.buttons[0];
            if (isRecord(buttonRaw) && buttonRaw.type === 'URL') {
              enableButton = true;
              buttonText = typeof buttonRaw.text === 'string' ? buttonRaw.text : '';
              buttonUrl = typeof buttonRaw.url === 'string' ? buttonRaw.url : '';
            }
          }
        }

        carouselCards.push({
          id: createCarouselCardId(),
          imageHandle,
          imageMediaUrl,
          imageFileName: imageHandle ? 'existing-media' : '',
          bodyText: cardBodyText,
          enableButton,
          buttonText,
          buttonUrl,
        });
      }

      continue;
    }

    if (type === 'HEADER') {
      const format = typeof raw.format === 'string' ? raw.format.toUpperCase() : 'TEXT';
      const example = raw.example as { header_handle?: string[]; header_media_url?: string } | undefined;
      if (format === 'IMAGE') {
        headerType = 'image';
        headerMediaFormat = 'IMAGE';
        headerMediaHandle = example?.header_handle?.[0] ?? '';
        headerMediaUrl = example?.header_media_url ?? '';
      } else if (format === 'VIDEO') {
        headerType = 'video';
        headerMediaFormat = 'VIDEO';
        headerMediaHandle = example?.header_handle?.[0] ?? '';
        headerMediaUrl = example?.header_media_url ?? '';
      } else if (format === 'DOCUMENT') {
        headerType = 'document';
        headerMediaFormat = 'DOCUMENT';
        headerMediaHandle = example?.header_handle?.[0] ?? '';
        headerMediaUrl = example?.header_media_url ?? '';
      } else if (typeof raw.text === 'string') {
        headerType = 'text';
        headerText = metaTextToNamed(raw.text, indexToName);
        headerSamples = readExampleStrings(raw.example);
      }
      continue;
    }

    if (type === 'BODY' && typeof raw.text === 'string') {
      bodyText = metaTextToNamed(raw.text, indexToName);
      bodySamples = readExampleStrings(raw.example);
      continue;
    }

    if (type === 'FOOTER' && typeof raw.text === 'string') {
      enableFooter = true;
      footerText = raw.text;
      continue;
    }

    if (type === 'BUTTONS' && Array.isArray(raw.buttons)) {
      for (const buttonRaw of raw.buttons) {
        if (!isRecord(buttonRaw) || typeof buttonRaw.type !== 'string') {
          continue;
        }

        const buttonType = buttonRaw.type.toUpperCase();
        const text = typeof buttonRaw.text === 'string' ? buttonRaw.text : '';

        if (buttonType === 'QUICK_REPLY') {
          enableQuickReplies = true;
          quickReplyButtons.push({ id: createButtonRowId(), text });
          continue;
        }

        if (buttonType === 'URL') {
          enableCallToAction = true;
          const url = typeof buttonRaw.url === 'string' ? metaTextToNamed(buttonRaw.url, indexToName) : '';
          urlButtons.push({
            id: createButtonRowId(),
            text,
            url,
            urlType: /\{\{[^}]+\}\}/.test(url) ? 'dynamic' : 'static',
          });
          continue;
        }

        if (buttonType === 'PHONE_NUMBER') {
          enablePhoneButton = true;
          phoneButtonText = text;
          const phone =
            typeof buttonRaw.phone_number === 'string'
              ? buttonRaw.phone_number
              : typeof buttonRaw.phoneNumber === 'string'
                ? buttonRaw.phoneNumber
                : '';
          const split = splitPhoneNumber(phone);
          phoneCountryCode = split.countryCode;
          phoneNumber = split.nationalNumber;
          continue;
        }

        if (buttonType === 'COPY_CODE') {
          enableCopyCode = true;
          copyCodeText = text;
          const example = Array.isArray(buttonRaw.example)
            ? String(buttonRaw.example[0] ?? '')
            : typeof buttonRaw.example === 'string'
              ? buttonRaw.example
              : '';
          copyCodeExample = example;
        }
      }
    }
  }

  const variableSamples = {
    ...buildVariableSamples(variableSchema, bodySamples),
    ...buildVariableSamples(
      {
        variables: (variableSchema?.variables ?? []).filter((variable) =>
          headerText.includes(`{{${variable.name ?? variable.index}}}`),
        ),
      },
      headerSamples,
    ),
  };

  return {
    ...base,
    templateFormat,
    carouselCards,
    headerType,
    headerText,
    headerMediaHandle,
    headerMediaUrl: headerMediaUrl || undefined,
    headerMediaFormat,
    headerMediaFileName: headerMediaHandle ? 'existing-media' : '',
    bodyText,
    variableSamples,
    enableFooter,
    footerText,
    enableQuickReplies,
    quickReplyButtons,
    enableCallToAction,
    urlButtons,
    linkTrackingEnabled: variableSchema?.linkTrackingEnabled ?? false,
    enablePhoneButton,
    phoneButtonText,
    phoneCountryCode,
    phoneNumber,
    enableCopyCode,
    copyCodeText,
    copyCodeExample,
  };
}
