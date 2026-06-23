import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthProvider';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div className="mb-4 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-lg">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
