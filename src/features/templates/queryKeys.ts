export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...templateKeys.lists(), params] as const,
  detail: (id: string) => [...templateKeys.all, 'detail', id] as const,
};
