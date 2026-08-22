export function toApiQueryParams(
  params: Record<string, string | number | boolean | undefined>,
): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '' && value !== 'all')
      .map(([key, value]) => [key, typeof value === 'boolean' ? String(value) : value]),
  ) as Record<string, string | number>;
}
