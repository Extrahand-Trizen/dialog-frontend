import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { PlatformAuthProvider } from '@/features/platform-admin/context/PlatformAuthProvider';
import { AppRouter } from '@/app/router';
import { queryClient } from '@/app/queryClient';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PlatformAuthProvider>
            <AppRouter />
            <Toaster />
          </PlatformAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
