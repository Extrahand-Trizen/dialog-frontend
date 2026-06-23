import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getApiErrorDebugInfo } from '@/lib/api-error';
import { cn } from '@/lib/utils';

type InlineErrorProps = {
  error: unknown;
  onRetry?: () => void;
  className?: string;
};

export function InlineError({ error, onRetry, className }: InlineErrorProps) {
  const { message, correlationId } = getApiErrorDebugInfo(error);

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4',
        className,
      )}
    >
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
        <div className="space-y-1 text-sm">
          <p>{message}</p>
          {correlationId ? (
            <p className="font-mono text-xs text-muted-foreground">Correlation: {correlationId}</p>
          ) : null}
        </div>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
