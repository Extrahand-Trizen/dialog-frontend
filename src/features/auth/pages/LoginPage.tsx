import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthPageShell } from '@/components/shared/AuthPageShell';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { loginFormSchema, type LoginFormValues } from '@/features/auth/schemas';
import { APP_NAME, APP_TAGLINE } from '@/constants/branding';
import { getApiErrorMessage } from '@/lib/api-error';

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!isLoading && isAuthenticated) {
    const redirectTo =
      (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
      '/overview';
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values);
      const redirectTo =
        (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
        '/overview';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
    }
  });

  return (
    <AuthPageShell
      title={`Sign in to ${APP_NAME}`}
      description={APP_TAGLINE}
      footer={
        <p className="text-xs tracking-wide text-muted-foreground">
          <Link to="/" className="transition hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 text-border">·</span>
          <Link to="/privacy" className="transition hover:text-foreground">
            Privacy
          </Link>
          <span className="mx-2 text-border">·</span>
          <Link to="/terms" className="transition hover:text-foreground">
            Terms
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[0.8125rem] font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="h-11 rounded-xl border-border/80 bg-background px-3.5 text-[0.9375rem] shadow-none transition focus-visible:ring-primary/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[0.8125rem] font-medium">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border/80 bg-background px-3.5 text-[0.9375rem] shadow-none transition focus-visible:ring-primary/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            className="h-11 w-full rounded-xl text-[0.9375rem] font-medium"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>
    </AuthPageShell>
  );
}
