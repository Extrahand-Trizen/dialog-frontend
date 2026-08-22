import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { sendConversationReply } from '@/features/inbox/api/inboxApi';
import { conversationKeys } from '@/features/inbox/queryKeys';
import type { SendConversationReplyRequest } from '@/features/inbox/types';
import { toastMutationError, toastMutationSuccess } from '@/lib/mutation-toast';
import type { ApiErrorBody } from '@/types/api';

export function isOutsideWindowError(error: unknown): boolean {
  if (!isAxiosError<ApiErrorBody>(error)) return false;
  const details = error.response?.data?.details;
  return !!details && typeof details === 'object' && details.errorReason === 'OUTSIDE_24H_WINDOW';
}

export function useSendReply(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SendConversationReplyRequest) => sendConversationReply(conversationId, body),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: conversationKeys.all });
      toastMutationSuccess(result.duplicate ? 'Message already queued for this key' : 'Reply sent');
    },
    onError: (error) => {
      if (isOutsideWindowError(error)) {
        toastMutationError(
          error,
          "This conversation's 24-hour reply window has closed — send an approved template instead.",
        );
        return;
      }
      toastMutationError(error, 'Failed to send reply');
    },
  });
}