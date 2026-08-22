/** Parse recipient phones from pasted text (newlines, commas, semicolons, spaces). */
export function parseRecipientPhones(raw: string): {
  phones: string[];
  invalid: string[];
} {
  const tokens = raw
    .split(/[\n,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const phones: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();

  for (const token of tokens) {
    const digits = token.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      invalid.push(token);
      continue;
    }
    if (seen.has(digits)) continue;
    seen.add(digits);
    phones.push(digits);
  }

  return { phones, invalid };
}

export type CampaignRecipientResult = {
  phone: string;
  status:
    | 'pending'
    | 'sending'
    | 'queued'
    | 'sent'
    | 'delivered'
    | 'read'
    | 'failed'
    | 'duplicate';
  messageId?: string;
  error?: string;
};
