const DRAFT_KEY_PREFIX = 'trizendialog_inbox_draft_';

/** Per-conversation reply drafts, persisted so switching chats doesn't lose what you typed. */
export function readDraft(conversationId: string): string {
  try {
    return localStorage.getItem(DRAFT_KEY_PREFIX + conversationId) ?? '';
  } catch {
    return '';
  }
}

export function writeDraft(conversationId: string, text: string): void {
  try {
    if (text) {
      localStorage.setItem(DRAFT_KEY_PREFIX + conversationId, text);
    } else {
      localStorage.removeItem(DRAFT_KEY_PREFIX + conversationId);
    }
  } catch {
    // Ignore storage errors (private browsing, quota exceeded, etc.) — drafts are a
    // convenience, never something a send should be blocked on.
  }
}
