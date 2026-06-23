import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTemplate } from '@/features/templates/api/createTemplate';
import { templateKeys } from '@/features/templates/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';
import type { CreateTemplateRequest } from '@/features/templates/types';

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: CreateTemplateRequest) => createTemplate(req),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: templateKeys.all });
      toastMutationSuccess('Template submitted to Meta for approval');
    },
    onError: (error) => toastMutationError(error, 'Failed to create template'),
  });
}
