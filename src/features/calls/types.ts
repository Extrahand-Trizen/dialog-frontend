export const CALL_DIRECTIONS = ['outgoing', 'incoming'] as const;
export type CallDirection = (typeof CALL_DIRECTIONS)[number];

export const CALL_STATUSES = [
  'queued',
  'ringing',
  'answered',
  'completed',
  'missed',
  'busy',
  'no_answer',
  'failed',
  'cancelled',
] as const;
export type CallStatus = (typeof CALL_STATUSES)[number];

export const CALL_HISTORY_FILTERS = ['all', 'incoming', 'outgoing', 'missed'] as const;
export type CallHistoryFilter = (typeof CALL_HISTORY_FILTERS)[number];

export const LIVE_CALL_PHASES = [
  'idle',
  'confirm',
  'outgoing',
  'active',
  'ended',
] as const;
export type LiveCallPhase = (typeof LIVE_CALL_PHASES)[number];

export type CallContact = {
  id: string;
  name: string;
  phoneE164: string;
  maskedPhone: string;
  avatarInitials: string;
  avatarColor: string;
  whatsappAvailable: boolean;
  company?: string | null;
  email?: string | null;
};

export type CallRecord = {
  id: string;
  contactId: string;
  direction: CallDirection;
  status: CallStatus;
  /** Duration in seconds; null for missed/rejected */
  durationSeconds: number | null;
  startedAt: string;
  endedAt: string | null;
  virtualNumber: string;
  maskingActive?: boolean;
  contact?: CallContact;
};

export type ConversationTimelineItem =
  | {
      id: string;
      kind: 'message';
      direction: 'inbound' | 'outbound';
      body: string;
      at: string;
    }
  | {
      id: string;
      kind: 'call';
      callId: string;
      direction: CallDirection;
      status: CallStatus;
      durationSeconds: number | null;
      at: string;
    };

export type CallingNotification = {
  id: string;
  type: 'missed_call' | 'completed_call' | 'whatsapp_message';
  contactId: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
};

export type CallingSettings = {
  providerName: string;
  providerStatus: 'connected' | 'disconnected' | 'degraded';
  virtualNumber: string;
  callerIdDisplay: string;
  recordCalls: boolean;
  announceMaskedCalling: boolean;
  businessHoursOnly: boolean;
  privacyNote: string;
};

export type LiveCallSession = {
  contact: CallContact;
  phase: Exclude<LiveCallPhase, 'idle'>;
  direction: CallDirection;
  virtualNumber: string;
  elapsedSeconds: number;
  endedStatus: CallStatus | null;
  callId?: string;
};
