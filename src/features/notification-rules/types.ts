export type NotificationRuleTemplateRefDto = {
  id: string;
  metaTemplateName: string;
  metaStatus: string;
  language: string;
};

export type NotificationRulePhoneRefDto = {
  id: string;
  displayNumber: string;
  isDefault: boolean;
};

export type NotificationRuleDto = {
  id: string;
  organizationId: string;
  eventKey: string;
  name: string;
  version: number;
  templateId: string;
  templateVersionId: string | null;
  phoneNumberId: string | null;
  variableMapping: Record<string, string>;
  enabled: boolean;
  priority: number;
  template: NotificationRuleTemplateRefDto;
  phoneNumber: NotificationRulePhoneRefDto | null;
  createdAt: string;
  updatedAt: string;
};

export type ListNotificationRulesRequest = {
  page: number;
  limit: number;
  enabled?: 'true' | 'false';
  eventKey?: string;
  templateId?: string;
};

export type CreateNotificationRuleRequest = {
  eventKey: string;
  name: string;
  templateId: string;
  templateVersionId?: string;
  phoneNumberId?: string;
  variableMapping?: Record<string, string>;
  enabled?: boolean;
  priority?: number;
};

export type UpdateNotificationRuleRequest = {
  eventKey?: string;
  name?: string;
  templateId?: string;
  templateVersionId?: string | null;
  phoneNumberId?: string | null;
  variableMapping?: Record<string, string>;
  enabled?: boolean;
  priority?: number;
};
