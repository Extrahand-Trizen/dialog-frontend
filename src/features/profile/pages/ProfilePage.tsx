import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { getUserDisplayName } from '@/features/auth/types';

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Account</CardTitle>
        <CardDescription>Details from your active session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">Name</p>
          <p className="font-medium">{getUserDisplayName(user)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Role</p>
          <Badge variant="secondary">{user.role}</Badge>
        </div>
        <div>
          <p className="text-muted-foreground">Organization</p>
          <p className="font-medium">{user.organizationSlug}</p>
        </div>
      </CardContent>
    </Card>
  );
}
