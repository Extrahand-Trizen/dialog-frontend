import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { canViewAdminNav } from '@/lib/permissions';

type AdminRouteProps = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();

  if (!canViewAdminNav(user)) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
}
