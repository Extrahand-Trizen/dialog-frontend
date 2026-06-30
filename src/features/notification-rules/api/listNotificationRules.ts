import { getPaginated } from '@/lib/api-client';
import { toApiQueryParams } from '@/lib/query-params';
import type {
  ListNotificationRulesRequest,
  NotificationRuleDto,
} from '@/features/notification-rules/types';

export async function listNotificationRules(req: ListNotificationRulesRequest) {
  return getPaginated<NotificationRuleDto>(
    '/notification-rules',
    toApiQueryParams(req as Record<string, string | number | undefined>),
  );
}
