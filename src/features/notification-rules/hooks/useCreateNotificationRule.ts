import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNotificationRule } from '@/features/notification-rules/api/createNotificationRule';
import { notificationRuleKeys } from '@/features/notification-rules/queryKeys';
import type { CreateNotificationRuleRequest } from '@/features/notification-rules/types';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useCreateNotificationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: CreateNotificationRuleRequest) => createNotificationRule(req),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationRuleKeys.all });
      toastMutationSuccess('Notification rule created');
    },
    onError: (error) => toastMutationError(error, 'Failed to create rule'),
  });
}
