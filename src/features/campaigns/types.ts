export type CampaignRecipientStatus =
  | 'pending'
  | 'sending'
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'duplicate';

export type CampaignRecipient = {
  phone: string;
  status: CampaignRecipientStatus;
  messageId?: string;
  error?: string;
};

export type Campaign = {
  id: string;
  name: string;
  templateName: string;
  language: string;
  phoneNumberId: string | null;
  variables: Record<string, string> | null;
  status: 'sending' | 'completed';
  recipientCount: number;
  queuedCount: number;
  sentCount: number;
  failedCount: number;
  duplicateCount: number;
  createdAt: string;
  completedAt: string | null;
  recipients?: CampaignRecipient[];
};
