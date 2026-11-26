import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
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
  lightBackground?: boolean;
};

export function AuthPageShell({
  title,
  description,
  children,
  icon,
  brandHref = '/',
  footer,
  className,
  lightBackground = false,
}: AuthPageShellProps) {
  return (
    <div
      className={cn(
        'auth-shell relative flex min-h-screen w-full items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-12',
        lightBackground ? 'bg-white' : 'bg-slate-950',
        className,
      )}
    >
      <Link
        to="/"
        className={cn(
          'absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition sm:left-6 sm:top-6',
          lightBackground
            ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950'
            : 'border-white/15 bg-black/25 text-slate-200 hover:text-white',
        )}
      >
        <ArrowLeft className="size-4" />
        <span>Back</span>
      </Link>

      {/* 2-Column Split Layout Container */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Brand, Headline, & Feature Badges */}
          <div className="space-y-6 text-left lg:col-span-7">
            {/* Logo */}
            <Link
              to={brandHref}
              className="inline-flex items-center gap-3 transition hover:opacity-90"
            >
              {icon ?? (
                <img
                  src="/extrahand-logo.png"
                  alt=""
                  className="size-11 object-contain"
                />
              )}
              <span
                className={cn(
                  'font-display text-2xl font-bold tracking-tight',
                  lightBackground
                    ? 'text-slate-900'
                    : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
                )}
              >
                {APP_NAME}
              </span>
            </Link>

            {/* Pill Tag */}
            <div>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold',
                  lightBackground
                    ? 'border border-[#f0d58f] bg-[#fff8df] text-[#a86d00]'
                    : 'border border-[#f5b82e]/40 bg-[#f5b82e]/20 text-[#f5d56f] backdrop-blur-sm',
                )}
              >
                One platform for
              </span>
            </div>

            {/* Main Hero Headline */}
            <h1
              className={cn(
                'font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]',
                lightBackground
                  ? 'text-slate-900'
                  : 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]',
              )}
            >
              WhatsApp <br className="hidden sm:inline" />
              Operations <span className="text-[#f5b82e]">in control.</span>
            </h1>

            {/* Description */}
            <p
              className={cn(
                'max-w-lg text-base leading-relaxed sm:text-lg',
                lightBackground ? 'text-slate-600' : 'text-slate-200/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]',
              )}
            >
              Manage notifications, handle delivery workflows, and keep every message on track.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 sm:gap-4">
              <div
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3',
                  lightBackground
                    ? 'border border-slate-200 bg-slate-50 shadow-sm'
                    : 'border border-white/15 bg-black/25 shadow-md backdrop-blur-md',
                )}
              >
                <span className={cn(
                  'flex size-9 items-center justify-center rounded-xl',
                  lightBackground
                    ? 'border border-[#f0d58f] bg-[#fff8df] text-[#a86d00]'
                    : 'border border-[#f5b82e]/40 bg-[#f5b82e]/20 text-[#f5d56f]',
                )}>
                  <MessageSquare className="size-4" strokeWidth={2.25} />
                </span>
                <div className="text-left leading-tight">
                  <p className={cn('text-sm font-semibold', lightBackground ? 'text-slate-900' : 'text-white')}>WhatsApp</p>
                  <p className={cn('text-xs', lightBackground ? 'text-slate-500' : 'text-slate-300')}>Send & receive messages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Form Card */}
          <div className="flex w-full justify-center lg:col-span-5 lg:justify-end">
            <div
              className={cn(
                'w-full max-w-[440px] rounded-3xl p-7 sm:p-9',
                lightBackground
                  ? 'border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]'
                  : 'border border-white/20 bg-white/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl dark:bg-card/95',
              )}
            >
              {/* Card Header */}
              <div className="mb-6 flex items-center gap-2.5">
                {icon ?? (
                  <img
                    src="/extrahand-logo.png"
                    alt=""
                    className="size-8 object-contain"
                  />
                )}
                <span className="font-display text-lg font-bold tracking-tight text-foreground">
                  {APP_NAME}
                </span>
              </div>

              <div className="mb-6 space-y-1.5 text-left">
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Form Content (Unchanged) */}
              {children}

              {/* Footer */}
              {footer ? (
                <div className="mt-6 border-t border-border/60 pt-4 text-center">
                  {footer}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
