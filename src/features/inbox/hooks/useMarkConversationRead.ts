import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markConversationRead } from '@/features/inbox/api/inboxApi';
import { conversationKeys } from '@/features/inbox/queryKeys';

export function useMarkConversationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markConversationRead(conversationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}
