import { useQuery } from '@tanstack/react-query';
import { listConversations } from '@/features/inbox/api/inboxApi';
import { conversationKeys } from '@/features/inbox/queryKeys';
import type { ListConversationsRequest } from '@/features/inbox/types';

const CONVERSATION_LIST_POLL_MS = 5000;

export function useConversations(params: ListConversationsRequest) {
  return useQuery({
    queryKey: conversationKeys.list(params),
    queryFn: () => listConversations(params),
    placeholderData: (prev) => prev,
    refetchInterval: CONVERSATION_LIST_POLL_MS,
  });
}
