import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  APP_HERO_HEADLINE,
  APP_NAME,
  APP_SHORT_DESCRIPTION,
} from '@/constants/branding';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { LANDING_FEATURES, LANDING_STEPS } from '@/features/landing/constants';
import { LandingHeroPreview } from '@/features/landing/components/LandingHeroPreview';

export function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const dashboardHref = isAuthenticated ? '/overview' : '/login';
  const primaryCta = isAuthenticated ? 'Open dashboard' : 'Sign in';

  return (
    <div className="landing min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
        {/* Top Contact Bar */}
        <div className="border-b border-border/60 bg-muted/50 py-2.5 text-sm text-muted-foreground">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 sm:justify-start sm:px-6">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">Talk To Sales:</span>
              <a
                href="tel:8639648822"
                className="inline-flex items-center gap-2 font-medium text-foreground/80 transition hover:text-primary hover:underline underline-offset-4"
              >
                <Phone className="size-3.5 text-primary" />
                <span>+91 8639648822</span>
              </a>
            </div>
            <span className="hidden text-border/80 sm:inline">|</span>
            <div className="flex items-center">
              <a
                href="mailto:contact@trizenventures.com"
                className="inline-flex items-center gap-2 font-medium text-foreground/80 transition hover:text-primary hover:underline underline-offset-4"
              >
                <Mail className="size-3.5 text-primary" />
                <span>contact@trizenventures.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-foreground">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <MessageSquare className="size-4" strokeWidth={2.25} />
            </div>
            <span className="font-display text-base font-semibold tracking-tight">{APP_NAME}</span>
          </Link>
          <nav className="flex items-center gap-2">
            {!isLoading ? (
              <Button size="sm" className="landing-cta-hover h-9 rounded-xl px-4" asChild>
                <Link to={dashboardHref}>
                  {primaryCta}
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            ) : null}
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div aria-hidden className="auth-shell-bg absolute inset-0" />
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
            <div className="max-w-xl">
              <p className="landing-fade-up mb-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {APP_NAME}
              </p>
              <h1 className="landing-fade-up landing-fade-up-delay-1 text-xl font-medium leading-snug tracking-tight text-foreground/90 sm:text-2xl">
                {APP_HERO_HEADLINE}
              </h1>
              <p className="landing-fade-up landing-fade-up-delay-2 mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
                {APP_SHORT_DESCRIPTION}
              </p>
              <div className="landing-fade-up landing-fade-up-delay-3 mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" className="landing-cta-hover h-11 rounded-xl px-5" asChild>
                  <Link to={dashboardHref}>
                    {primaryCta}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-11 rounded-xl px-5" asChild>
                  <a href="#how-it-works">How it works</a>
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

        <section className="bg-primary py-16 text-primary-foreground sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to manage your WhatsApp ops?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-primary-foreground/85">
              Sync templates, monitor delivery, and connect your backends.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="landing-cta-hover mt-8 h-11 rounded-xl bg-primary-foreground px-6 text-primary hover:bg-primary-foreground/90"
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
            © {new Date().getFullYear()} {APP_NAME}
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
