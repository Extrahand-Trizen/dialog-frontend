import { Link } from 'react-router-dom';
import { Check, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPricingViewProps {
  dashboardHref: string;
}

export function LandingPricingView({ dashboardHref }: LandingPricingViewProps) {
  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Plans & <span className="text-[#059669]">Pricing</span>
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Flexible plans for every business. Choose the perfect plan and start
            building better customer conversations today.
          </p>

          {/* Trust Banner Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-y-2 rounded-full border border-[#bbf0df] bg-[#e8f7f2] px-6 py-2 text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-[#059669] shadow-2xs">
            <span>12000+ BUSINESSES</span>
            <span className="mx-3 text-[#79d4ba] select-none">|</span>
            <span>15+ YEARS OF TRUST</span>
            <span className="mx-3 text-[#79d4ba] select-none">|</span>
            <span>30-DAY FULL REFUND POLICY</span>
          </div>
        </div>

        {/* Outer CPaaS Card Wrapper */}
        <div className="mt-12 sm:mt-14 max-w-6xl mx-auto rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xs">
          {/* Header inside wrapper */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#22c55e] text-white shadow-xs">
              <MessageSquare className="size-5" strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Communication Platform as a Service
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                CPaaS (Calls + WhatsApp)
              </p>
            </div>
          </div>

          {/* 3 Pricing Columns */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 items-stretch">
            {/* Starter Plan */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Starter</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                    ₹5,000
                  </span>
                  <span className="text-xs sm:text-sm font-semibold uppercase text-slate-500">
                    /MONTH
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">10 Users</p>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Perfect for small teams getting started.
                </p>

                <div className="mt-5">
                  <Button
                    variant="outline"
                    className="w-full rounded-lg border-slate-300 font-semibold text-slate-800 hover:bg-slate-50 h-10"
                    asChild
                  >
                    <Link to={dashboardHref}>Start Free Trial</Link>
                  </Button>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs italic text-slate-500 mb-3">Includes:</p>
                  <ul className="space-y-2.5">
                    {[
                      'IVR system',
                      'Unlimited In-Out Calling',
                      'Call recording',
                      'WhatsApp chat',
                      'Sticky agents',
                      'WhatsApp broadcasts',
                      'Team and department setup',
                      'Basic performance reports',
                      'Shopify integration',
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-slate-700">
                        <Check className="size-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Growth Plan (Most Popular) */}
            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-[#10b981] bg-white p-6 sm:p-7 shadow-sm">
              <div className="absolute -top-3.5 right-6 rounded-full bg-[#e6f7f2] border border-[#a3e8d2] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#059669]">
                MOST POPULAR
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Growth</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                    ₹15,000
                  </span>
                  <span className="text-xs sm:text-sm font-semibold uppercase text-slate-500">
                    /MONTH
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">10 Users</p>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  More capacity, integration & reporting.
                </p>

                <div className="mt-5">
                  <Button
                    className="w-full rounded-lg bg-[#059669] hover:bg-[#047857] font-semibold text-white shadow-sm h-10 transition"
                    asChild
                  >
                    <Link to={dashboardHref}>Start Free Trial</Link>
                  </Button>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs italic text-slate-500 mb-3">
                    Everything in Starter, plus:
                  </p>

                  {/* CALLING & ROUTING */}
                  <div className="mb-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                      CALLING & ROUTING
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Higher calling capacity',
                        'Web-call + Whispering & Barging',
                        'Smart IVR + call routing',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-slate-700">
                          <Check className="size-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* WHATSAPP */}
                  <div className="mb-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                      WHATSAPP
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Higher broadcast limits',
                        'After-call WhatsApp automation',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-slate-700">
                          <Check className="size-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ANALYTICS & INTEGRATIONS */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                      ANALYTICS & INTEGRATIONS
                    </p>
                    <ul className="space-y-2">
                      {[
                        'CRM and 100+ integrations',
                        'Webhooks and API access',
                        'Real-time dashboards and reporting',
                        'Agent shift management',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-slate-700">
                          <Check className="size-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                    ₹25,000
                  </span>
                  <span className="text-xs sm:text-sm font-semibold uppercase text-slate-500">
                    /MONTH
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">20 Users</p>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Built for growing teams and advanced needs.
                </p>

                <div className="mt-5">
                  <Button
                    variant="outline"
                    className="w-full rounded-lg border-slate-300 font-semibold text-slate-800 hover:bg-slate-50 h-10"
                    asChild
                  >
                    <Link to={dashboardHref}>Start Free Trial</Link>
                  </Button>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs italic text-slate-500 mb-3">
                    Everything in Growth, plus:
                  </p>

                  {/* CALLING & ROUTING */}
                  <div className="mb-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                      CALLING & ROUTING
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Dedicated calling number',
                        'Advanced call routing & scheduling',
                        'Call analytics & live monitoring',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-slate-700">
                          <Check className="size-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* WHATSAPP */}
                  <div className="mb-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                      WHATSAPP
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Unlimited broadcast limits',
                        'WhatsApp template messages',
                        'Advanced automation workflows',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-slate-700">
                          <Check className="size-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ANALYTICS & INTEGRATIONS */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                      ANALYTICS & INTEGRATIONS
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Custom reports & dashboards',
                        'API access with higher limits',
                        'Multi-location support',
                        'Priority support',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-slate-700">
                          <Check className="size-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
