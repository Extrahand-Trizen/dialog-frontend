import { useMutation, useQueryClient } from '@tanstack/react-query';
import { connectAccount } from '@/features/whatsapp/api/connectAccount';
import { whatsappKeys } from '@/features/whatsapp/queryKeys';
import type { ConnectWhatsAppAccountRequest } from '@/features/whatsapp/types';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useConnectAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: ConnectWhatsAppAccountRequest) => connectAccount(req),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: whatsappKeys.all });
      toastMutationSuccess('WhatsApp account connected');
    },
    onError: (error) => toastMutationError(error, 'Failed to connect account'),
  });
}
