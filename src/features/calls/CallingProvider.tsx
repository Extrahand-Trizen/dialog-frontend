import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { CallContact, CallRecord, LiveCallSession } from './types';
import { endCall as endCallApi, getCall, getCallContact, initiateCall } from './api/callsApi';
import { callKeys } from './queryKeys';

type CallingContextValue = {
  session: LiveCallSession | null;
  pendingContact: CallContact | null;
  errorMessage: string | null;
  openConfirm: (contactIdOrContact: string | CallContact) => Promise<void>;
  cancelConfirm: () => void;
  startOutgoing: () => Promise<void>;
  endCall: (status?: 'COMPLETED' | 'MISSED' | 'CANCELLED' | 'FAILED') => Promise<void>;
  callAgain: () => Promise<void>;
  closeSession: () => void;
  muted: boolean;
  speakerOn: boolean;
  toggleMute: () => void;
  toggleSpeaker: () => void;
};

const CallingContext = createContext<CallingContextValue | null>(null);

function toErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as { message?: string } | undefined;
    return body?.message || error.message;
  }
  return error instanceof Error ? error.message : 'Could not start the call';
}

function recordToSession(record: CallRecord & { contact: CallContact }): LiveCallSession {
  const contact = record.contact;
  const ended =
    record.status === 'completed' ||
    record.status === 'missed' ||
    record.status === 'cancelled' ||
    record.status === 'failed' ||
    record.status === 'busy' ||
    record.status === 'no_answer';
  const phase = ended ? 'ended' : record.status === 'answered' ? 'active' : 'outgoing';
  return {
    contact,
    phase,
    direction: record.direction,
    virtualNumber: record.virtualNumber,
    elapsedSeconds: record.durationSeconds ?? 0,
    endedStatus: ended ? record.status : null,
    callId: record.id,
  };
}

export function CallingProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [pendingContact, setPendingContact] = useState<CallContact | null>(null);
  const [session, setSession] = useState<(LiveCallSession & { callId?: string }) | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

  const invalidateLists = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: callKeys.all });
  }, [queryClient]);

  const openConfirm = useCallback(async (contactIdOrContact: string | CallContact) => {
    setErrorMessage(null);
    if (typeof contactIdOrContact === 'string') {
      const contact = await getCallContact(contactIdOrContact);
      setPendingContact(contact);
      return;
    }
    setPendingContact(contactIdOrContact);
  }, []);

  const cancelConfirm = useCallback(() => {
    setPendingContact(null);
  }, []);

  const startOutgoing = useCallback(async () => {
    if (!pendingContact) return;
    setErrorMessage(null);
    setMuted(false);
    setSpeakerOn(false);
    try {
      const record = await initiateCall({
        contactId: pendingContact.id,
        name: pendingContact.name,
      });
      setPendingContact(null);
      setSession(recordToSession(record));
      invalidateLists();
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  }, [invalidateLists, pendingContact]);

  const callId = session && 'callId' in session ? session.callId : undefined;

  useEffect(() => {
    if (!callId || !session || session.phase === 'ended') return;
    const timer = window.setInterval(() => {
      void getCall(callId)
        .then((record) => {
          setSession((prev) => {
            if (!prev) return prev;
            const next = recordToSession(record);
            if (next.phase === 'active' && prev.phase === 'active') {
              return {
                ...next,
                elapsedSeconds: prev.elapsedSeconds + 1,
              };
            }
            return next;
          });
        })
        .catch(() => undefined);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [callId, session?.phase]);

  const endCall = useCallback(
    async (status: 'COMPLETED' | 'MISSED' | 'CANCELLED' | 'FAILED' = 'CANCELLED') => {
      if (!callId) {
        setSession(null);
        return;
      }
      try {
        const record = await endCallApi(callId, status);
        setSession(recordToSession(record));
        invalidateLists();
      } catch (error) {
        setErrorMessage(toErrorMessage(error));
      }
    },
    [callId, invalidateLists],
  );

  const callAgain = useCallback(async () => {
    const contact = session?.contact;
    if (!contact) return;
    setMuted(false);
    setSpeakerOn(false);
    setErrorMessage(null);
    try {
      const record = await initiateCall({ contactId: contact.id });
      setSession(recordToSession(record));
      invalidateLists();
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  }, [invalidateLists, session?.contact]);

  const closeSession = useCallback(() => {
    setSession(null);
    setErrorMessage(null);
    setMuted(false);
    setSpeakerOn(false);
    invalidateLists();
  }, [invalidateLists]);

  const value = useMemo<CallingContextValue>(
    () => ({
      session,
      pendingContact,
      errorMessage,
      openConfirm,
      cancelConfirm,
      startOutgoing,
      endCall,
      callAgain,
      closeSession,
      muted,
      speakerOn,
      toggleMute: () => setMuted((v) => !v),
      toggleSpeaker: () => setSpeakerOn((v) => !v),
    }),
    [
      session,
      pendingContact,
      errorMessage,
      openConfirm,
      cancelConfirm,
      startOutgoing,
      endCall,
      callAgain,
      closeSession,
      muted,
      speakerOn,
    ],
  );

  return <CallingContext.Provider value={value}>{children}</CallingContext.Provider>;
}

export function useCalling(): CallingContextValue {
  const ctx = useContext(CallingContext);
  if (!ctx) {
    throw new Error('useCalling must be used within CallingProvider');
  }
  return ctx;
}
