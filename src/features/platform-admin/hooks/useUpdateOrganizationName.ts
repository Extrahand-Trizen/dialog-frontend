import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrganizationName } from '@/features/platform-admin/api/organizations';
import { platformOrganizationKeys } from '@/features/platform-admin/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useUpdateOrganizationName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateOrganizationName(id, name),
    onSuccess: (organization) => {
      void queryClient.invalidateQueries({ queryKey: platformOrganizationKeys.all });
      toastMutationSuccess(`Renamed to ${organization.name}`);
    },
    onError: (error) => toastMutationError(error, 'Failed to update client name'),
  });
}
