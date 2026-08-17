import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { copyTemplates } from '@/features/templates/api/copyTemplates';
import { templateKeys } from '@/features/templates/queryKeys';
import { toastMutationError } from '@/lib/mutation-toast';
import type { CopyTemplatesRequest, CopyTemplatesResponse } from '@/features/templates/types';

function formatCopySummary(result: CopyTemplatesResponse): string {
  const parts = [`Copied ${result.copiedCount}`];
  if (result.skippedCount > 0) {
    parts.push(`${result.skippedCount} already existed`);
  }
  if (result.failedCount > 0) {
    parts.push(`${result.failedCount} failed`);
  }
  return parts.join(' · ');
}

export function useCopyTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: CopyTemplatesRequest) => copyTemplates(req),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: templateKeys.all });
      if (result.failedCount > 0 && result.copiedCount === 0) {
        const firstFailure = result.items.find((item) => item.status === 'failed');
        toast.error('Could not copy templates', {
          description: firstFailure?.message ?? formatCopySummary(result),
        });
        return;
      }
      if (result.failedCount > 0) {
        toast.error('Some templates could not be copied', {
          description: formatCopySummary(result),
        });
        return;
      }
      toast.success('Templates copied', { description: formatCopySummary(result) });
    },
    onError: (error) => toastMutationError(error, 'Failed to copy templates'),
  });
}
