import { get, getPaginated, patch, post } from '@/lib/api-client';
import { toApiQueryParams } from '@/lib/query-params';
import type {
  CallContact,
  CallHistoryFilter,
  CallRecord,
  CallingNotification,
  CallingSettings,
  ConversationTimelineItem,
} from '../types';

export type CallRecordDto = CallRecord & { contact: CallContact };

export async function listCalls(req: {
  page?: number;
  limit?: number;
  filter?: CallHistoryFilter;
  search?: string;
  contactId?: string;
}) {
  return getPaginated<CallRecordDto>(
    '/calls',
    toApiQueryParams(req as Record<string, string | number | undefined>),
  );
}

export async function getCall(callId: string): Promise<CallRecordDto> {
  return get<CallRecordDto>(`/calls/${callId}`);
}

export async function initiateCall(body: {
  contactId?: string;
  phone?: string;
  name?: string;
}): Promise<CallRecordDto> {
  return post<CallRecordDto, typeof body>('/calls', body);
}

export async function endCall(
  callId: string,
  status?: 'COMPLETED' | 'MISSED' | 'CANCELLED' | 'FAILED',
): Promise<CallRecordDto> {
  return post<CallRecordDto, { status?: string }>(`/calls/${callId}/end`, { status });
}

export async function listCallContacts(): Promise<CallContact[]> {
  return get<CallContact[]>('/calls/contacts');
}

export async function getCallContact(contactId: string): Promise<CallContact> {
  return get<CallContact>(`/calls/contacts/${contactId}`);
}

export async function getConversation(contactId: string): Promise<{
  contact: CallContact;
  items: ConversationTimelineItem[];
}> {
  return get(`/calls/contacts/${contactId}/conversation`);
}

export async function listCallNotifications(): Promise<CallingNotification[]> {
  return get<CallingNotification[]>('/calls/notifications');
}

export async function getCallingSettings(): Promise<CallingSettings> {
  return get<CallingSettings>('/calls/settings');
}

export async function updateCallingSettings(
  body: Partial<
    Pick<
      CallingSettings,
      | 'virtualNumber'
      | 'callerIdDisplay'
      | 'recordCalls'
      | 'announceMaskedCalling'
      | 'businessHoursOnly'
    >
  >,
): Promise<CallingSettings> {
  return patch<CallingSettings, typeof body>('/calls/settings', body);
}
