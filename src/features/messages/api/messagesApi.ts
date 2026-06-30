import { get, getPaginated } from '@/lib/api-client';
import { toApiQueryParams } from '@/lib/query-params';
import type {
  ListMessagesRequest,
  MessageDetailDto,
  MessageSummaryDto,
} from '@/features/messages/types';

export async function listMessages(req: ListMessagesRequest) {
  return getPaginated<MessageSummaryDto>(
    '/messages',
    toApiQueryParams(req as Record<string, string | number | undefined>),
  );
}

export type GetMessageRequest = {
  messageId: string;
};

export async function getMessage(req: GetMessageRequest): Promise<MessageDetailDto> {
  return get<MessageDetailDto>(`/messages/${req.messageId}`);
}
