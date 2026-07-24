import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendTemplateMessage } from '@/features/messages/api/messagesApi';
import { messageKeys } from '@/features/messages/queryKeys';
import type { SendTemplateMessageRequest } from '@/features/messages/types';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';

export function useSendTemplateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SendTemplateMessageRequest) => sendTemplateMessage(body),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      toastMutationSuccess(
        result.duplicate ? 'Message already queued for this key' : 'Message queued for delivery',
      );
    },
    onError: (error) => toastMutationError(error, 'Failed to send message'),
  });
}
