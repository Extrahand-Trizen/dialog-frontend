import { LogOut, Mail, Shield, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { getUserDisplayName, getUserInitials } from '@/features/auth/types';

const ROLE_HINT: Record<string, string> = {
  ADMIN: 'Full access to setup, keys, and messaging',
  MANAGER: 'Templates, messages, and operational tools',
  AGENT: 'Send and review WhatsApp messages',
  VIEWER: 'Read-only access to this organization',
};

export function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const roleHint = ROLE_HINT[user.role] ?? 'Organization member';

  const fields = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Shield, label: 'Role', value: user.role, badge: true },
    { icon: Building2, label: 'Organization', value: user.organizationSlug },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card className="overflow-hidden border-border/70 shadow-none">
        <div className="border-b border-border/60 bg-gradient-to-br from-primary/[0.07] via-background to-background px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 space-y-1">
              <h2 className="font-display text-xl font-semibold tracking-tight">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{roleHint}</p>
            </div>
          </div>
        </div>

        <CardContent className="divide-y divide-border/60 p-0">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-start gap-3 px-5 py-4 sm:items-center sm:px-6"
            >
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground sm:mt-0">
                <field.icon className="size-3.5" strokeWidth={2.25} />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">{field.label}</p>
                {'badge' in field && field.badge ? (
                  <Badge variant="secondary" className="font-mono text-[11px]">
                    {field.value}
                  </Badge>
                ) : (
                  <p className="truncate text-sm font-medium tracking-tight">{field.value}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Sign out</p>
            <p className="text-xs text-muted-foreground">
              End this session on this device.
            </p>
          </div>
          <Button variant="outline" className="h-9 w-full sm:w-auto" onClick={logout}>
            <LogOut className="mr-2 size-3.5" />
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
