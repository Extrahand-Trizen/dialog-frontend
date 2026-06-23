import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setDefaultPhone } from '@/features/whatsapp/api/setDefaultPhone';
import { whatsappKeys } from '@/features/whatsapp/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useSetDefaultPhone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, phoneId }: { accountId: string; phoneId: string }) =>
      setDefaultPhone({ accountId, phoneId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: whatsappKeys.all });
      toastMutationSuccess('Default phone updated');
    },
    onError: (error) => toastMutationError(error, 'Failed to set default phone'),
  });
}
