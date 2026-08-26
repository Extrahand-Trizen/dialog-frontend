import { useQuery } from '@tanstack/react-query';
import { getUnreadConversationsCount } from '@/features/inbox/api/inboxApi';
import { conversationKeys } from '@/features/inbox/queryKeys';

// Slower than the Inbox page's own polling — this runs on every page via the
// sidebar, so it stays lightweight (a single COUNT query) and polls less often.
const UNREAD_COUNT_POLL_MS = 20000;

export function useUnreadConversationsCount(enabled: boolean) {
  return useQuery({
    queryKey: conversationKeys.unreadCount(),
    queryFn: getUnreadConversationsCount,
    enabled,
    refetchInterval: UNREAD_COUNT_POLL_MS,
    select: (data) => data.unreadCount,
  });
}
