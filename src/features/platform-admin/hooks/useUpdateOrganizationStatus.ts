import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrganizationStatus } from '@/features/platform-admin/api/organizations';
import { platformOrganizationKeys } from '@/features/platform-admin/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useUpdateOrganizationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateOrganizationStatus(id, isActive),
    onSuccess: (organization) => {
      void queryClient.invalidateQueries({ queryKey: platformOrganizationKeys.all });
      toastMutationSuccess(
        organization.isActive
          ? `${organization.name} reactivated`
          : `${organization.name} deactivated`,
      );
    },
    onError: (error) => toastMutationError(error, 'Failed to update organization'),
  });
}
