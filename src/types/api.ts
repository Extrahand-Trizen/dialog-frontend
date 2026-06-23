export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccessBody<T> = {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

export type ApiErrorBody = {
  success: false;
  message: string;
  errorCode?: string;
  details?: Record<string, unknown>;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};
