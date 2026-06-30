export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...messageKeys.lists(), params] as const,
  detail: (id: string) => [...messageKeys.all, 'detail', id] as const,
};
