export const notificationRuleKeys = {
  all: ['notification-rules'] as const,
  lists: () => [...notificationRuleKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...notificationRuleKeys.lists(), params] as const,
  detail: (id: string) => [...notificationRuleKeys.all, 'detail', id] as const,
};
