import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNotificationRule } from '@/features/notification-rules/api/deleteNotificationRule';
import { notificationRuleKeys } from '@/features/notification-rules/queryKeys';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useDeleteNotificationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleId: string) => deleteNotificationRule({ ruleId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationRuleKeys.all });
      toastMutationSuccess('Notification rule deleted');
    },
    onError: (error) => toastMutationError(error, 'Failed to delete rule'),
  });
}
