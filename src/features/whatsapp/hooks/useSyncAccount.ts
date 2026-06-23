import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncAccount } from '@/features/whatsapp/api/syncAccount';
import { whatsappKeys } from '@/features/whatsapp/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useSyncAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => syncAccount({ accountId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: whatsappKeys.all });
      toastMutationSuccess('Account synced');
    },
    onError: (error) => toastMutationError(error, 'Failed to sync account'),
  });
}
