import { Link } from 'react-router-dom';
import {
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { LANDING_FEATURES, LANDING_STEPS } from '@/features/landing/constants';
import { LandingHeroPreview } from '@/features/landing/components/LandingHeroPreview';

const LANDING_APP_NAME = 'ExtraHand';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const dashboardHref = isAuthenticated ? '/overview' : '/login';
  const primaryCta = isAuthenticated ? 'Open dashboard' : 'Sign in';

  return (
    <div className="landing min-h-screen bg-background">
      <header className="sticky top-0 z-30 w-full bg-white shadow-xs">
        {/* Main Navbar */}
        <div className="border-b border-slate-200/70 bg-white">
          <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/extrahand-logo.png"
                alt=""
                className="size-9 sm:size-10 object-contain transition group-hover:brightness-105"
              />
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {LANDING_APP_NAME}
              </span>
            </Link>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to={dashboardHref}
                className="hidden sm:inline-flex text-[15px] font-medium text-slate-800 transition hover:text-slate-950 px-2 py-1.5"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
            <section className="relative overflow-hidden border-b border-border/60">
          <div aria-hidden className="auth-shell-bg absolute inset-0" />
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
            <div className="max-w-2xl">
              <h1 className="landing-fade-up landing-fade-up-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
                WhatsApp Ops
              </h1>
              <div className="landing-fade-up landing-fade-up-delay-2 mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm sm:text-[15px] font-medium text-slate-600">
                <p className="w-full text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Run WhatsApp notifications without the chaos
                </p>
                <p className="mt-1 max-w-xl text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base">
                  Templates, delivery, and backend integrations — one console for WhatsApp Business.
                </p>
              </div>
              <div className="landing-fade-up landing-fade-up-delay-3 mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  className="landing-cta-hover h-12 rounded-xl bg-[#f5b82e] hover:bg-[#e5a820] px-6 text-[15px] font-semibold text-slate-900 shadow-sm inline-flex items-center gap-3 transition"
                  asChild
                >
                  <Link to={dashboardHref}>
                    <span>{isAuthenticated ? 'Open dashboard' : 'Sign in'}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-slate-300 bg-white hover:bg-slate-50 px-6 text-[15px] font-semibold text-slate-800 shadow-xs inline-flex items-center gap-2 transition"
                  asChild
                >
                  <a href="/#how-it-works">How it works</a>
                </Button>
              </div>
            </div>
            <LandingHeroPreview />
          </div>
        </section>

        <section id="features" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything in one console
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
              Built for teams shipping on WhatsApp Business Platform.
            </p>
            <ul className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {LANDING_FEATURES.map((feature) => (
                <li key={feature.title} className="min-w-0">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-border/60 bg-muted/35 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
              {LANDING_STEPS.map((item) => (
                <li key={item.step} className="min-w-0">
                  <span className="font-display text-4xl font-semibold tabular-nums text-primary/35">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#f5b82e] py-16 text-slate-900 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to manage your WhatsApp dialogs?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-slate-800">
              Sync templates, monitor delivery, and connect your backends.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="landing-cta-hover mt-8 h-11 rounded-xl bg-slate-900 px-6 text-white hover:bg-slate-800"
              asChild
            >
              <Link to={dashboardHref}>{primaryCta}</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {LANDING_APP_NAME}
          </p>
          <div className="flex gap-5">
            <Link to="/privacy" className="transition hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="transition hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
