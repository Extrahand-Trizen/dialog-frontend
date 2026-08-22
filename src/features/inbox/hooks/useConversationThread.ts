import { useQuery } from '@tanstack/react-query';
import { getConversationThread } from '@/features/inbox/api/inboxApi';
import { conversationKeys } from '@/features/inbox/queryKeys';
import type { ListConversationThreadRequest } from '@/features/inbox/types';

const THREAD_POLL_MS = 3000;

export function useConversationThread(
  conversationId: string | undefined,
  params: ListConversationThreadRequest,
) {
  return useQuery({
    queryKey: conversationKeys.thread(conversationId ?? '', params),
    queryFn: () => getConversationThread(conversationId!, params),
    enabled: !!conversationId,
    placeholderData: (prev) => prev,
    refetchInterval: THREAD_POLL_MS,
  });
}
