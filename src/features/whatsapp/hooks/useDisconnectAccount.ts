import { useMutation, useQueryClient } from '@tanstack/react-query';
import { disconnectAccount } from '@/features/whatsapp/api/disconnectAccount';
import { whatsappKeys } from '@/features/whatsapp/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useDisconnectAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => disconnectAccount({ accountId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: whatsappKeys.all });
      toastMutationSuccess('WhatsApp account disconnected');
    },
    onError: (error) => toastMutationError(error, 'Failed to disconnect account'),
  });
}
