import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Mail,
  Menu,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { APP_NAME } from '@/constants/branding';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { LANDING_FEATURES, LANDING_STEPS } from '@/features/landing/constants';
import { LandingHeroPreview } from '@/features/landing/components/LandingHeroPreview';
import { LandingPricingView } from '@/features/landing/components/LandingPricingView';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isPricing = location.pathname === '/pricing' || location.search.includes('tab=pricing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dashboardHref = isAuthenticated ? '/overview' : '/login';
  const primaryCta = isAuthenticated ? 'Open dashboard' : 'Sign in';

  return (
    <div className="landing min-h-screen bg-background">
      <header className="sticky top-0 z-30 w-full bg-white shadow-xs">
        {/* Top Contact Bar */}
        <div className="border-b border-slate-200/80 bg-[#f0f4f8] py-1.5 text-xs text-slate-600">
          <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-2.5 gap-y-0.5">
              <span className="font-normal text-slate-600">Talk To Sales:</span>
              <a
                href="tel:+918639648822"
                className="inline-flex items-center gap-1 font-medium text-[#2563eb] transition hover:text-blue-700 hover:underline"
              >
                <Phone className="size-3 text-[#2563eb]" />
                <span>+91 8639648822</span>
              </a>
              <span className="mx-1.5 sm:mx-2 text-slate-300 select-none">|</span>
              <a
                href="mailto:contact@trizenventures.com"
                className="inline-flex items-center gap-1 font-medium text-[#2563eb] transition hover:text-blue-700 hover:underline"
              >
                <Mail className="size-3 text-[#2563eb]" />
                <span>contact@trizenventures.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="border-b border-slate-200/70 bg-white">
          <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#22c55e] text-white shadow-sm transition group-hover:brightness-105">
                <MessageSquare className="size-5" strokeWidth={2.4} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-7 lg:flex xl:gap-9 h-full">
              <Link
                to="/pricing"
                className={`h-[70px] inline-flex items-center text-[15px] transition-colors border-b-2 -mb-[1px] ${
                  isPricing
                    ? 'border-[#059669] font-semibold text-slate-900'
                    : 'border-transparent font-medium text-slate-700 hover:text-slate-950'
                }`}
              >
                Pricing
              </Link>

              {/* Platform Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1.5 text-[15px] font-medium text-slate-700 outline-none transition hover:text-slate-950">
                  <span>Platform</span>
                  <ChevronDown className="size-3.5 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/templates">Template Management</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/messages">Message Delivery</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/inbox">Team Inbox & Chat</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/virtual-numbers">Virtual Numbers & Voice</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/developer/webhooks">Developer Webhooks</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Solution Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1.5 text-[15px] font-medium text-slate-700 outline-none transition hover:text-slate-950">
                  <span>Solution</span>
                  <ChevronDown className="size-3.5 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/#features">Customer Support Ops</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/#features">Order & Delivery Alerts</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/#features">Authentication & OTP</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/#features">Enterprise Scale Sending</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1.5 text-[15px] font-medium text-slate-700 outline-none transition hover:text-slate-950">
                  <span>Resources</span>
                  <ChevronDown className="size-3.5 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/#how-it-works">How It Works</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/developer/voice">API Reference</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <a
                      href="https://developers.facebook.com/docs/whatsapp"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Meta WhatsApp Docs
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Company Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1.5 text-[15px] font-medium text-slate-700 outline-none transition hover:text-slate-950">
                  <span>Company</span>
                  <ChevronDown className="size-3.5 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <a href="mailto:contact@trizenventures.com">Contact Sales</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/privacy">Privacy Policy</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950" asChild>
                    <Link to="/terms">Terms of Service</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to={dashboardHref}
                className="hidden sm:inline-flex text-[15px] font-medium text-slate-800 transition hover:text-slate-950 px-2 py-1.5"
              >
                Log in
              </Link>
              <Link
                to={dashboardHref}
                className="inline-flex items-center justify-center rounded-lg bg-[#059669] px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#047857] active:scale-[0.98]"
              >
                {isAuthenticated ? 'Open dashboard' : 'Sign Up'}
              </Link>

              {/* Mobile Menu Sheet */}
              <div className="lg:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-700 hover:text-slate-950">
                      <Menu className="size-6" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-white p-6">
                    <SheetHeader className="text-left pb-4 border-b">
                      <SheetTitle className="flex items-center gap-2.5 text-slate-900">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#22c55e] text-white">
                          <MessageSquare className="size-4" strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-lg">{APP_NAME}</span>
                      </SheetTitle>
                    </SheetHeader>

                    <div className="mt-6 flex flex-col space-y-4">
                      <Link
                        to="/pricing"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`py-2 text-base font-medium ${
                          isPricing
                            ? 'font-semibold text-[#059669]'
                            : 'text-slate-800 hover:text-slate-950'
                        }`}
                      >
                        Pricing
                      </Link>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Platform
                        </p>
                        <Link
                          to="/templates"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-sm text-slate-700 hover:text-slate-950"
                        >
                          Template Management
                        </Link>
                        <Link
                          to="/messages"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-sm text-slate-700 hover:text-slate-950"
                        >
                          Message Delivery
                        </Link>
                        <Link
                          to="/inbox"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-sm text-slate-700 hover:text-slate-950"
                        >
                          Team Inbox
                        </Link>
                        <Link
                          to="/virtual-numbers"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-sm text-slate-700 hover:text-slate-950"
                        >
                          Virtual Numbers
                        </Link>
                      </div>

                      <div className="space-y-1 pt-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Company
                        </p>
                        <Link
                          to="/privacy"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-sm text-slate-700 hover:text-slate-950"
                        >
                          Privacy Policy
                        </Link>
                        <Link
                          to="/terms"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-sm text-slate-700 hover:text-slate-950"
                        >
                          Terms of Service
                        </Link>
                      </div>

                      <div className="pt-4 border-t space-y-3">
                        <Link
                          to={dashboardHref}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex w-full items-center justify-center rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-800"
                        >
                          Log in
                        </Link>
                        <Link
                          to={dashboardHref}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex w-full items-center justify-center rounded-lg bg-[#059669] py-2.5 text-sm font-semibold text-white shadow-sm"
                        >
                          {isAuthenticated ? 'Open dashboard' : 'Sign Up'}
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {isPricing ? (
          <LandingPricingView dashboardHref={dashboardHref} />
        ) : (
          <>
            <section className="relative overflow-hidden border-b border-border/60">
          <div aria-hidden className="auth-shell-bg absolute inset-0" />
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
            <div className="max-w-2xl">
              <p className="landing-fade-up text-xs sm:text-sm font-bold tracking-widest text-slate-800 uppercase mb-3 sm:mb-4">
                ENGAGE. SELL. SUPPORT.
              </p>
              <h1 className="landing-fade-up landing-fade-up-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
                On{' '}
                <span className="relative inline-block">
                  <span>WhatsApp & Calls.</span>
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full overflow-visible text-[#06b6d4]"
                    height="8"
                    viewBox="0 0 280 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 5.5C80 2 200 2 278 6"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                With Your Team &
                <br />
                Our AI Agents.
              </h1>
              <div className="landing-fade-up landing-fade-up-delay-2 mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm sm:text-[15px] font-medium text-slate-600">
                <span>Campaigns</span>
                <span className="text-slate-300 select-none">|</span>
                <span>AI Bots</span>
                <span className="text-slate-300 select-none">|</span>
                <span>IVR</span>
                <span className="text-slate-300 select-none">|</span>
                <span>Live Call & Chat</span>
                <span className="text-slate-300 select-none">|</span>
                <span>Customer Intelligence</span>
              </div>
              <div className="landing-fade-up landing-fade-up-delay-3 mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  className="landing-cta-hover h-12 rounded-xl bg-[#0b132b] hover:bg-[#1a2544] px-6 text-[15px] font-semibold text-white shadow-md inline-flex items-center gap-3 transition"
                  asChild
                >
                  <Link to={dashboardHref}>
                    <span>Start Free Trial</span>
                    <span className="flex size-5 items-center justify-center rounded bg-[#06b6d4] text-[#0b132b]">
                      <ArrowUpRight className="size-3.5 stroke-[2.75]" />
                    </span>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-slate-300 bg-white hover:bg-slate-50 px-6 text-[15px] font-semibold text-slate-800 shadow-xs inline-flex items-center gap-2 transition"
                  asChild
                >
                  <a href="mailto:contact@trizenventures.com?subject=Book%20a%20Demo%20-%20Trizen%20Dialog">
                    <Calendar className="size-4 text-slate-700" />
                    <span>Book A Demo</span>
                  </a>
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
              Ready to manage your WhatsApp dialogs?
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
          </>
        )}
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
