import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteTemplates } from '@/features/templates/api/deleteTemplates';
import { templateKeys } from '@/features/templates/queryKeys';
import { toastMutationError } from '@/lib/mutation-toast';
import type { DeleteTemplatesRequest, DeleteTemplatesResponse } from '@/features/templates/types';

function formatDeleteSummary(result: DeleteTemplatesResponse): string {
  const parts = [`Deleted ${result.deletedCount}`];
  if (result.skippedCount > 0) {
    parts.push(`${result.skippedCount} in use`);
  }
  if (result.failedCount > 0) {
    parts.push(`${result.failedCount} failed`);
  }
  return parts.join(' · ');
}

export function useDeleteTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: DeleteTemplatesRequest) => deleteTemplates(req),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: templateKeys.all });
      if (result.failedCount > 0 && result.deletedCount === 0) {
        const firstFailure = result.items.find((item) => item.status === 'failed');
        toast.error('Could not delete templates', {
          description: firstFailure?.message ?? formatDeleteSummary(result),
        });
        return;
      }
      if (result.failedCount > 0 || result.skippedCount > 0) {
        toast.error('Some templates were not deleted', {
          description: formatDeleteSummary(result),
        });
        return;
      }
      toast.success('Templates deleted', { description: formatDeleteSummary(result) });
    },
    onError: (error) => toastMutationError(error, 'Failed to delete templates'),
  });
}
