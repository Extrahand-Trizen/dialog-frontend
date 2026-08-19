import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { canSyncTemplates } from '@/lib/permissions';

type ManagerRouteProps = {
  children: React.ReactNode;
};

/** Admin or Manager — operational routes (e.g. template create/edit). */
export function ManagerRoute({ children }: ManagerRouteProps) {
  const { user } = useAuth();

  if (!canSyncTemplates(user)) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
}
