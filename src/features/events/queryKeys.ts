export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...eventKeys.lists(), params] as const,
};
