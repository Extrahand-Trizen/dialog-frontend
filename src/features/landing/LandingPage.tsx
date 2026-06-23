import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME, APP_SHORT_DESCRIPTION, APP_TAGLINE } from '@/constants/branding';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { LANDING_FEATURES, LANDING_STEPS } from '@/features/landing/constants';
import { LandingHeroPreview } from '@/features/landing/components/LandingHeroPreview';

export function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const dashboardHref = isAuthenticated ? '/overview' : '/login';
  const primaryCta = isAuthenticated ? 'Open dashboard' : 'Sign in';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="size-4" />
            </div>
            <span className="font-semibold tracking-tight">{APP_NAME}</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="#features">Features</a>
            </Button>
            {!isLoading && !isAuthenticated ? (
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            ) : null}
            <Button size="sm" asChild>
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
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.18),transparent)]"
            aria-hidden
          />
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <Sparkles className="size-3.5 text-primary" />
                {APP_TAGLINE}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                Run WhatsApp notifications{' '}
                <span className="text-primary">without the chaos</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">{APP_SHORT_DESCRIPTION}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <Link to={dashboardHref}>
                    {primaryCta}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </div>
            </div>
            <LandingHeroPreview />
          </div>
        </section>

        <section id="features" className="border-b bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">Everything in one console</h2>
              <p className="mt-3 text-muted-foreground">
                Templates, sends, integrations, and webhooks — built for teams shipping on WhatsApp
                Business Platform.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {LANDING_FEATURES.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight">How it works</h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {LANDING_STEPS.map((item) => (
                <li key={item.step} className="relative rounded-xl border bg-card p-6">
                  <span className="text-3xl font-bold text-primary/30">{item.step}</span>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-semibold sm:text-3xl">Ready to manage your WhatsApp ops?</h2>
            <p className="mt-3 text-primary-foreground/85">
              Sign in to sync templates, monitor delivery, and connect your backends.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
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
