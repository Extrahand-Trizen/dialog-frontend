import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { syncTemplates } from '@/features/templates/api/syncTemplates';
import { templateKeys } from '@/features/templates/queryKeys';
import type { SyncTemplatesResponse } from '@/features/templates/types';

function formatSyncSummary(results: SyncTemplatesResponse[]): string {
  const syncedCount = results.reduce((sum, result) => sum + result.syncedCount, 0);
  const createdCount = results.reduce((sum, result) => sum + result.createdCount, 0);
  const updatedCount = results.reduce((sum, result) => sum + result.updatedCount, 0);

  const parts: string[] = [`Imported ${syncedCount} template(s) from Meta`];
  if (createdCount > 0) {
    parts.push(`${createdCount} new`);
  }
  if (updatedCount > 0) {
    parts.push(`${updatedCount} content update${updatedCount === 1 ? '' : 's'}`);
  }

  return `${parts.join(' · ')}. Approval status refreshed from Meta.`;
}

export function useSyncAllTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (whatsAppAccountIds: string[]) => {
      const settled = await Promise.allSettled(
        whatsAppAccountIds.map((whatsAppAccountId) => syncTemplates({ whatsAppAccountId })),
      );
      const succeeded = settled.flatMap((result) =>
        result.status === 'fulfilled' ? [result.value] : [],
      );
      const failedCount = settled.length - succeeded.length;

      if (succeeded.length === 0) {
        const firstError = settled.find((result) => result.status === 'rejected');
        throw firstError && firstError.status === 'rejected'
          ? firstError.reason
          : new Error('Template sync failed');
      }

      if (failedCount > 0) {
        toast.error('Some WhatsApp accounts failed to sync', {
          description: `${succeeded.length} of ${settled.length} accounts imported. Try Sync all again.`,
        });
      }

      return succeeded;
    },
    onSuccess: async (results) => {
      toast.success('Templates imported', {
        description: formatSyncSummary(results),
      });
      await queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
    onError: (error: Error) => {
      toast.error('Template sync failed', { description: error.message });
    },
  });
}
