const NAMED_PLACEHOLDER_RE = /\{\{([a-zA-Z_][a-zA-Z0-9_]*|\d+)\}\}/g;

/** Collect unique placeholder keys in first-seen order across texts. */
export function extractPlaceholders(...texts: string[]): string[] {
  const seen = new Set<string>();
  const order: string[] = [];

  for (const text of texts) {
    if (!text) continue;
    for (const match of text.matchAll(NAMED_PLACEHOLDER_RE)) {
      const key = match[1];
      if (!seen.has(key)) {
        seen.add(key);
        order.push(key);
      }
    }
  }

  return order;
}

/** Replace {{key}} placeholders with sample values when provided. */
export function substituteVariableSamples(
  text: string,
  samples: Record<string, string>,
): string {
  if (!text) return text;

  return text.replace(NAMED_PLACEHOLDER_RE, (_match, key: string) => {
    const sample = samples[key]?.trim();
    return sample || `{{${key}}}`;
  });
}

export function insertPlaceholderAtCursor(
  currentValue: string,
  selectionStart: number,
  selectionEnd: number,
  variableName: string,
): { nextValue: string; nextCursor: number } {
  const token = `{{${variableName}}}`;
  const nextValue =
    currentValue.slice(0, selectionStart) + token + currentValue.slice(selectionEnd);
  const nextCursor = selectionStart + token.length;
  return { nextValue, nextCursor };
}

export const PLACEHOLDER_NAME_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
