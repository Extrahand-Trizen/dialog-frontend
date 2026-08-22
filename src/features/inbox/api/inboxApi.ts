import { getPaginated, post } from '@/lib/api-client';
import { toApiQueryParams } from '@/lib/query-params';
import type {
  ConversationSummaryDto,
  ConversationThreadMessageDto,
  ListConversationsRequest,
  ListConversationThreadRequest,
  SendConversationReplyRequest,
  SendConversationReplyResult,
} from '@/features/inbox/types';

export async function listConversations(req: ListConversationsRequest) {
  return getPaginated<ConversationSummaryDto>(
    '/conversations',
    toApiQueryParams(req as Record<string, string | number | undefined>),
  );
}

export async function getConversationThread(
  conversationId: string,
  req: ListConversationThreadRequest,
) {
  const result = await getPaginated<ConversationThreadMessageDto>(
    `/conversations/${conversationId}/messages`,
    toApiQueryParams(req as Record<string, string | number | undefined>),
  );
  const conversation = (result.meta as { conversation?: ConversationSummaryDto }).conversation;
  return { ...result, conversation };
}

export async function markConversationRead(conversationId: string): Promise<null> {
  return post<null>(`/conversations/${conversationId}/read`);
}

export async function sendConversationReply(
  conversationId: string,
  body: SendConversationReplyRequest,
): Promise<SendConversationReplyResult> {
  return post<SendConversationReplyResult, SendConversationReplyRequest>(
    `/conversations/${conversationId}/messages`,
    body,
  );
}
