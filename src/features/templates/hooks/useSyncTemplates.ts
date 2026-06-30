import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncTemplates } from '@/features/templates/api/syncTemplates';
import { templateKeys } from '@/features/templates/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useSyncTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (whatsAppAccountId: string) => syncTemplates({ whatsAppAccountId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: templateKeys.all });
      toastMutationSuccess('Template sync queued');
    },
    onError: (error) => toastMutationError(error, 'Failed to queue template sync'),
  });
}
