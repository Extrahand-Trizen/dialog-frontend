import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { APP_NAME } from '@/constants/branding';
import { cn } from '@/lib/utils';

type AuthPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  icon?: ReactNode;
  brandHref?: string;
  footer?: ReactNode;
  className?: string;
};

export function AuthPageShell({
  title,
  description,
  children,
  icon,
  brandHref = '/',
  footer,
  className,
}: AuthPageShellProps) {
  return (
    <div
      className={cn(
        'auth-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14',
        className,
      )}
    >
      <div aria-hidden className="auth-shell-bg pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,hsl(var(--border)/0.55)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.55)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_20%,transparent_75%)]"
      />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-8 space-y-5 text-center sm:mb-10">
          <Link
            to={brandHref}
            className="inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm font-medium tracking-tight text-foreground shadow-sm backdrop-blur transition hover:border-border hover:bg-background"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {icon ?? <MessageSquare className="size-3.5" strokeWidth={2.25} />}
            </span>
            {APP_NAME}
          </Link>

          <div className="space-y-2.5">
            <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[2rem]">
              {title}
            </h1>
            <p className="mx-auto max-w-sm text-[0.9375rem] leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-[0_1px_2px_hsl(224_71%_4%/0.04),0_12px_40px_-16px_hsl(224_71%_4%/0.12)] backdrop-blur-md sm:p-8">
          {children}
        </div>

        {footer ? <div className="mt-8 text-center">{footer}</div> : null}
      </div>
    </div>
  );
}
