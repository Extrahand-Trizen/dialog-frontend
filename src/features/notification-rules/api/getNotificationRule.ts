import { get } from '@/lib/api-client';
import type { NotificationRuleDto } from '@/features/notification-rules/types';

export type GetNotificationRuleRequest = {
  ruleId: string;
};

export async function getNotificationRule(
  req: GetNotificationRuleRequest,
): Promise<NotificationRuleDto> {
  return get<NotificationRuleDto>(`/notification-rules/${req.ruleId}`);
}
