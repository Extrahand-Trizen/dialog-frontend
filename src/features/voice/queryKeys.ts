export const voiceKeys = {
  all: ['voice'] as const,
  numbers: () => [...voiceKeys.all, 'numbers'] as const,
  number: (id: string) => [...voiceKeys.all, 'number', id] as const,
  catalog: (country?: string) => [...voiceKeys.all, 'catalog', country ?? 'all'] as const,
};
