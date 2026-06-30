import { del } from '@/lib/api-client';

export type DeleteNotificationRuleRequest = {
  ruleId: string;
};

export async function deleteNotificationRule(req: DeleteNotificationRuleRequest): Promise<null> {
  return del<null>(`/notification-rules/${req.ruleId}`);
}
