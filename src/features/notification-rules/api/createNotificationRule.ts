import { post } from '@/lib/api-client';
import type {
  CreateNotificationRuleRequest,
  NotificationRuleDto,
} from '@/features/notification-rules/types';

export async function createNotificationRule(
  req: CreateNotificationRuleRequest,
): Promise<NotificationRuleDto> {
  return post<NotificationRuleDto, CreateNotificationRuleRequest>('/notification-rules', req);
}
