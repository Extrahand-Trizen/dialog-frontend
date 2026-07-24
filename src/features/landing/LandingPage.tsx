import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
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
      <header className="sticky top-0 z-30 border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-foreground">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <MessageSquare className="size-3.5" />
            </div>
            <span className="text-sm font-medium tracking-tight">{APP_NAME}</span>
          </Link>
          <nav className="flex items-center gap-2">
            {!isLoading && !isAuthenticated ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            ) : null}
            <Button size="sm" className="landing-cta-hover" asChild>
              <Link to={dashboardHref}>
                {primaryCta}
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_0%,hsl(var(--primary)/0.12),transparent)]"
            aria-hidden
          />
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:py-16">
            <div className="max-w-xl">
              <h1 className="landing-fade-up font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                {APP_HERO_HEADLINE}
              </h1>
              <p className="landing-fade-up landing-fade-up-delay-1 mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                {APP_SHORT_DESCRIPTION}
              </p>
              <div className="landing-fade-up landing-fade-up-delay-2 mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg" className="landing-cta-hover" asChild>
                  <Link to={dashboardHref}>
                    {primaryCta}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">How it works</a>
                </Button>
              </div>
            </div>
            <LandingHeroPreview />
          </div>
        </section>

        <section id="features" className="border-t py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything in one console
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Built for teams shipping on WhatsApp Business Platform.
            </p>
            <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {LANDING_FEATURES.map((feature) => (
                <li key={feature.title} className="min-w-0">
                  <feature.icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-3 text-base font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="how-it-works" className="border-t bg-muted/40 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {LANDING_STEPS.map((item) => (
                <li key={item.step} className="min-w-0">
                  <span className="font-display text-4xl font-semibold text-primary/40">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t bg-primary py-16 text-primary-foreground sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Ready to manage your WhatsApp ops?
            </h2>
            <p className="mt-3 text-primary-foreground/85">
              Sync templates, monitor delivery, and connect your backends.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="landing-cta-hover mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <Link to={dashboardHref}>{primaryCta}</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {APP_NAME}
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
