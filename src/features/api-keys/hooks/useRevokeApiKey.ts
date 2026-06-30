import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revokeApiKey } from '@/features/api-keys/api/revokeApiKey';
import { apiKeyKeys } from '@/features/api-keys/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (apiKeyId: string) => revokeApiKey({ apiKeyId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apiKeyKeys.all });
      toastMutationSuccess('API key revoked');
    },
    onError: (error) => toastMutationError(error, 'Failed to revoke API key'),
  });
}
