import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWhatsAppAccount } from '@/features/platform-admin/api/organizations';
import { platformOrganizationKeys } from '@/features/platform-admin/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useDeleteWhatsAppAccount(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => deleteWhatsAppAccount(organizationId, accountId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: platformOrganizationKeys.whatsAppAccounts(organizationId),
      });
      void queryClient.invalidateQueries({
        queryKey: platformOrganizationKeys.detail(organizationId),
      });
      void queryClient.invalidateQueries({
        queryKey: [...platformOrganizationKeys.all, 'whatsapp-account', organizationId],
      });
      void queryClient.invalidateQueries({ queryKey: platformOrganizationKeys.all });
      toastMutationSuccess('WhatsApp account removed');
    },
    onError: (error) => toastMutationError(error, 'Failed to remove WhatsApp account'),
  });
}
