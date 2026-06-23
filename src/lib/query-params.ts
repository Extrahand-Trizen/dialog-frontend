export function toApiQueryParams(
  params: Record<string, string | number | undefined>,
): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '' && value !== 'all',
    ),
  ) as Record<string, string | number>;
}
