import { patch } from '@/lib/api-client';
import type {
  NotificationRuleDto,
  UpdateNotificationRuleRequest,
} from '@/features/notification-rules/types';

export type UpdateNotificationRuleParams = {
  ruleId: string;
  body: UpdateNotificationRuleRequest;
};

export async function updateNotificationRule(
  req: UpdateNotificationRuleParams,
): Promise<NotificationRuleDto> {
  return patch<NotificationRuleDto, UpdateNotificationRuleRequest>(
    `/notification-rules/${req.ruleId}`,
    req.body,
  );
}
