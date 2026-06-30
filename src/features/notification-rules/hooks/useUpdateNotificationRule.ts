import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNotificationRule } from '@/features/notification-rules/api/updateNotificationRule';
import { notificationRuleKeys } from '@/features/notification-rules/queryKeys';
import type { UpdateNotificationRuleRequest } from '@/features/notification-rules/types';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useUpdateNotificationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ruleId, body }: { ruleId: string; body: UpdateNotificationRuleRequest }) =>
      updateNotificationRule({ ruleId, body }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: notificationRuleKeys.all });
      void queryClient.invalidateQueries({
        queryKey: notificationRuleKeys.detail(variables.ruleId),
      });
      toastMutationSuccess('Notification rule updated');
    },
    onError: (error) => toastMutationError(error, 'Failed to update rule'),
  });
}
