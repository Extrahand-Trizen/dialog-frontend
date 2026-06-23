import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTemplate } from '@/features/templates/api/updateTemplate';
import { templateKeys } from '@/features/templates/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';
import type { UpdateTemplateRequest } from '@/features/templates/types';

type UpdateTemplateVariables = {
  templateId: string;
  request: UpdateTemplateRequest;
};

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, request }: UpdateTemplateVariables) =>
      updateTemplate(templateId, request),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: templateKeys.all });
      void queryClient.setQueryData(templateKeys.detail(data.id), data);
      toastMutationSuccess('Template update submitted to Meta for approval');
    },
    onError: (error) => toastMutationError(error, 'Failed to update template'),
  });
}
