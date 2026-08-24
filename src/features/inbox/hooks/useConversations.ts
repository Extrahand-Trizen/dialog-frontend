import { useQuery } from '@tanstack/react-query';
import { listConversations } from '@/features/inbox/api/inboxApi';
import { conversationKeys } from '@/features/inbox/queryKeys';
import type { ListConversationsRequest } from '@/features/inbox/types';

const CONVERSATION_LIST_POLL_MS = 5000;

function listFilterKey(params: ListConversationsRequest): string {
  return JSON.stringify({
    search: params.search ?? '',
    unreadOnly: params.unreadOnly ?? false,
  });
}

export function useConversations(params: ListConversationsRequest) {
  return useQuery({
    queryKey: conversationKeys.list(params),
    queryFn: () => listConversations(params),
    placeholderData: (previousData, previousQuery) => {
      if (!previousData || !previousQuery) return undefined;
      const prevParams = previousQuery.queryKey[2] as ListConversationsRequest;
      if (listFilterKey(prevParams) !== listFilterKey(params)) {
        return undefined;
      }
      return previousData;
    },
    refetchInterval: CONVERSATION_LIST_POLL_MS,
  });
}
