import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

type ParamValue = string | number | undefined;

function readNumber(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function useTableParams<T extends Record<string, ParamValue>>(
  filterDefaults: T,
): {
  params: { page: number; limit: number } & T;
  setParams: (updates: Partial<{ page: number; limit: number } & T>) => void;
  resetPage: () => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const page = readNumber(searchParams.get('page'), DEFAULT_PAGE);
    const limit = readNumber(searchParams.get('limit'), DEFAULT_LIMIT);
    const filters = Object.fromEntries(
      Object.entries(filterDefaults).map(([key, defaultValue]) => {
        const raw = searchParams.get(key);
        if (raw === null || raw === '') {
          return [key, defaultValue];
        }
        return [key, raw as ParamValue];
      }),
    ) as T;

    return { page, limit, ...filters };
  }, [searchParams, filterDefaults]);

  const setParams = useCallback(
    (updates: Partial<{ page: number; limit: number } & T>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === '' || value === 'all') {
            next.delete(key);
            return;
          }
          next.set(key, String(value));
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const resetPage = useCallback(() => {
    setParams({ page: DEFAULT_PAGE } as Partial<{ page: number; limit: number } & T>);
  }, [setParams]);

  return { params, setParams, resetPage };
}
