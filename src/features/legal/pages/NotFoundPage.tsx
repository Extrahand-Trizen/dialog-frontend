import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Button asChild>
        <Link to="/overview">Go to overview</Link>
      </Button>
    </div>
  );
}
