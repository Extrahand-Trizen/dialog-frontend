import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone } from 'lucide-react';
import { APP_NAME } from '@/constants/branding';
import { cn } from '@/lib/utils';
import loginBg from '@/assets/login-bg.png';

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
        'auth-shell relative flex min-h-screen w-full items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-12',
        className,
      )}
    >
      {/* Clean Background Image Layer (NO grid lines / NO boxes) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={loginBg}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        {/* Smooth cinematic dark teal/slate gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-slate-950/50 backdrop-blur-[1px]" />
      </div>

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
              <span className="flex size-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                {icon ?? <MessageSquare className="size-5" strokeWidth={2.5} />}
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                {APP_NAME}
              </span>
            </Link>

            {/* Pill Tag */}
            <div>
              <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                One platform for
              </span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="font-display text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              Call & WhatsApp <br className="hidden sm:inline" />
              Operations <span className="text-emerald-400">in control.</span>
            </h1>

            {/* Description */}
            <p className="max-w-lg text-base leading-relaxed text-slate-200/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] sm:text-lg">
              Manage notifications, handle delivery workflows, and keep every message on track.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 sm:gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 shadow-md backdrop-blur-md">
                <span className="flex size-9 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/20 text-emerald-300">
                  <Phone className="size-4" strokeWidth={2.25} />
                </span>
                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-white">Calling</p>
                  <p className="text-xs text-slate-300">Make & receive calls</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 shadow-md backdrop-blur-md">
                <span className="flex size-9 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/20 text-emerald-300">
                  <MessageSquare className="size-4" strokeWidth={2.25} />
                </span>
                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-white">WhatsApp</p>
                  <p className="text-xs text-slate-300">Send & receive messages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Form Card */}
          <div className="flex w-full justify-center lg:col-span-5 lg:justify-end">
            <div className="w-full max-w-[440px] rounded-3xl border border-white/20 bg-white/95 p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-9 dark:bg-card/95">
              {/* Card Header */}
              <div className="mb-6 flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  {icon ?? <MessageSquare className="size-4" strokeWidth={2.5} />}
                </span>
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
