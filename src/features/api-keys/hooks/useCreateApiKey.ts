import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiKey } from '@/features/api-keys/api/createApiKey';
import { apiKeyKeys } from '@/features/api-keys/queryKeys';
import type { CreateApiKeyRequest } from '@/features/api-keys/types';
import { toastMutationError } from '@/lib/mutation-toast';

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: CreateApiKeyRequest) => createApiKey(req),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apiKeyKeys.all });
    },
    onError: (error) => toastMutationError(error, 'Failed to create API key'),
  });
}
