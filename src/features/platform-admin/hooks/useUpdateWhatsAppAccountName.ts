import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWhatsAppAccountName } from '@/features/platform-admin/api/organizations';
import { platformOrganizationKeys } from '@/features/platform-admin/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useUpdateWhatsAppAccountName(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, name }: { accountId: string; name: string }) =>
      updateWhatsAppAccountName(organizationId, accountId, name),
    onSuccess: (account) => {
      void queryClient.invalidateQueries({
        queryKey: platformOrganizationKeys.whatsAppAccounts(organizationId),
      });
      void queryClient.invalidateQueries({
        queryKey: platformOrganizationKeys.detail(organizationId),
      });
      void queryClient.invalidateQueries({
        queryKey: [...platformOrganizationKeys.all, 'whatsapp-account', organizationId],
      });
      toastMutationSuccess(`Renamed to ${account.name ?? account.metaWabaId}`);
    },
    onError: (error) => toastMutationError(error, 'Failed to rename WhatsApp account'),
  });
}
