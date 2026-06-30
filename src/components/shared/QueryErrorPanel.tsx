import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getApiErrorDebugInfo } from '@/lib/api-error';

type QueryErrorPanelProps = {
  error: unknown;
  onRetry?: () => void;
  title?: string;
};

export function QueryErrorPanel({
  error,
  onRetry,
  title = 'Could not load data',
}: QueryErrorPanelProps) {
  const { message, errorCode, correlationId } = getApiErrorDebugInfo(error);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center"
    >
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
        {errorCode ? (
          <p className="font-mono text-xs text-muted-foreground">Code: {errorCode}</p>
        ) : null}
        {correlationId ? (
          <p className="font-mono text-xs text-muted-foreground">
            Correlation: {correlationId}
          </p>
        ) : null}
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
