import { Outlet } from 'react-router-dom';
import { CallingProvider } from './CallingProvider';
import { CallConfirmModal } from './components/CallConfirmModal';
import { CallSessionOverlay } from './components/CallSessionOverlay';

/** Authenticated calling routes with live call session overlay. */
export function CallingLayout() {
  return (
    <CallingProvider>
      <Outlet />
      <CallConfirmModal />
      <CallSessionOverlay />
    </CallingProvider>
  );
}
