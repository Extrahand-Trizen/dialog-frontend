import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api-error';

export function toastMutationError(error: unknown, fallback?: string): void {
  toast.error(getApiErrorMessage(error, fallback ?? 'Request failed'));
}

export function toastMutationSuccess(message: string): void {
  toast.success(message);
}
