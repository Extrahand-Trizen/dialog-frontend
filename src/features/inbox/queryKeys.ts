export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...conversationKeys.lists(), params] as const,
  thread: (id: string, params: Record<string, unknown>) =>
    [...conversationKeys.all, 'thread', id, params] as const,
  unreadCount: () => [...conversationKeys.all, 'unread-count'] as const,
};
