import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function TermsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>TrizenDialog terms placeholder. Replace with legal copy before production.</p>
          <Button asChild variant="outline">
            <Link to="/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
