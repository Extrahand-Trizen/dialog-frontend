export const platformAuthKeys = {
  all: ['platform-auth'] as const,
  me: () => [...platformAuthKeys.all, 'me'] as const,
};

export const platformOrganizationKeys = {
  all: ['platform-organizations'] as const,
  list: (params: { page: number; limit: number; search?: string }) =>
    [...platformOrganizationKeys.all, 'list', params] as const,
  detail: (id: string) => [...platformOrganizationKeys.all, 'detail', id] as const,
};
