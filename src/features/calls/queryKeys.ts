export const callKeys = {
  all: ['calls'] as const,
  lists: () => [...callKeys.all, 'list'] as const,
  list: (params: unknown) => [...callKeys.lists(), params] as const,
  detail: (id: string) => [...callKeys.all, 'detail', id] as const,
  contacts: () => [...callKeys.all, 'contacts'] as const,
  contact: (id: string) => [...callKeys.all, 'contact', id] as const,
  conversation: (id: string) => [...callKeys.all, 'conversation', id] as const,
  notifications: () => [...callKeys.all, 'notifications'] as const,
  settings: () => [...callKeys.all, 'settings'] as const,
};
