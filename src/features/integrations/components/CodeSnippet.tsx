import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CodeSnippetProps = {
  code: string;
  label?: string;
  className?: string;
};

export function CodeSnippet({ code, label, className }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      ) : null}
      <div className="group relative rounded-lg border bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          onClick={() => void handleCopy()}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
        </Button>
        <pre className="overflow-x-auto p-3 pr-12 text-xs leading-relaxed text-foreground">{code}</pre>
      </div>
    </div>
  );
}
