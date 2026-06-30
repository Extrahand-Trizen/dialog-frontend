import { isAxiosError } from 'axios';
import type { ApiErrorBody } from '@/types/api';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function getApiErrorCode(error: unknown): string | undefined {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.errorCode;
  }
  return undefined;
}

export function getApiErrorCorrelationId(error: unknown): string | undefined {
  if (!isAxiosError<ApiErrorBody>(error)) return undefined;
  const details = error.response?.data?.details;
  if (!details || typeof details !== 'object') return undefined;
  const correlationId = details.correlationId;
  return typeof correlationId === 'string' ? correlationId : undefined;
}

export function getApiErrorDebugInfo(error: unknown): {
  message: string;
  errorCode?: string;
  correlationId?: string;
} {
  return {
    message: getApiErrorMessage(error),
    errorCode: getApiErrorCode(error),
    correlationId: getApiErrorCorrelationId(error),
  };
}
