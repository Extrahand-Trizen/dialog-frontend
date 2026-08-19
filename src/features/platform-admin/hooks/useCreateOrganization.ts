import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrganization } from '@/features/platform-admin/api/organizations';
import { platformOrganizationKeys } from '@/features/platform-admin/queryKeys';
import type { CreateOrganizationInput } from '@/features/platform-admin/types';
import { toastMutationError } from '@/lib/mutation-toast';

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrganizationInput) => createOrganization(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: platformOrganizationKeys.all });
    },
    onError: (error) => toastMutationError(error, 'Failed to create organization'),
  });
}
