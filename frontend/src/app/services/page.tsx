import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "All 12 Alpha Insiight research services — equity cash, index & stock futures, index & stock options, MCX commodities, the Big Combo and the Trial Pack.",
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1639754390580-2e7437267698?q=80&w=1600&auto=format&fit=crop";

type Tier = { name: string; duration: string; price: string };
type Service = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tiers: Tier[];
};

const CATEGORIES: { title: string; tag: string; services: Service[] }[] = [
  {
    title: "Equity Cash Research",
    tag: "NSE Cash",
    services: [
      {
        id: "cash",
        name: "INSIIGHT CASH",
        tagline: "Professional Equity Intraday Research",
        description:
          "1–2 researched intraday opportunities per trading day in the equity cash segment, with clear entry, target and stop-loss levels.",
        tiers: [
          { name: "Quarterly", duration: "3 Months", price: "₹25,000" },
          { name: "Half-Yearly", duration: "6 Months", price: "₹45,000" },
          { name: "Yearly", duration: "12 Months", price: "₹75,000" },
        ],
      },
      {
        id: "cash-pro",
        name: "INSIIGHT CASH PRO",
        tagline: "Premium Equity Intraday Research",
        description:
          "The premium evolution of Insiight Cash — PRO stock-selection engine, multi-timeframe confirmation, deep sector intelligence and priority research support.",
        tiers: [{ name: "Yearly", duration: "12 Months", price: "₹1,51,000" }],
      },
    ],
  },
  {
    title: "Index Derivatives Research",
    tag: "NIFTY / BANK NIFTY",
    services: [
      {
        id: "index-future",
        name: "INSIIGHT INDEX FUTURE",
        tagline: "Professional Index Futures Research",
        description:
          "NIFTY & BANK NIFTY futures research — trend, price action, Open Interest and momentum, with disciplined entry, target and stop-loss levels.",
        tiers: [
          { name: "Prime", duration: "3 Months", price: "₹35,000" },
          { name: "Advance", duration: "6 Months", price: "₹70,000" },
          { name: "Elite", duration: "12 Months", price: "₹1,25,000" },
        ],
      },
      {
        id: "index-future-pro",
        name: "INSIIGHT INDEX FUTURE PRO",
        tagline: "Premium Index Futures Intelligence",
        description:
          "The PRO evolution — OI positioning matrix, multi-timeframe index mapping, scenario engine and a premium pre-market command desk.",
        tiers: [
          { name: "PRO Start", duration: "3 Months", price: "₹45,000" },
          { name: "PRO Advance", duration: "6 Months", price: "₹85,000" },
          { name: "PRO Elite", duration: "12 Months", price: "₹1,51,000" },
        ],
      },
      {
        id: "index-option",
        name: "INSIIGHT INDEX OPTION",
        tagline: "Professional Index Options Research",
        description:
          "NIFTY & BANK NIFTY options research — Call/Put setups, option-chain intelligence, OI, PCR, IV and premium behaviour.",
        tiers: [
          { name: "Prime", duration: "2 Months", price: "₹45,000" },
          { name: "Advance", duration: "4 Months", price: "₹80,000" },
          { name: "Elite", duration: "6 Months", price: "₹1,25,000" },
        ],
      },
      {
        id: "index-pro",
        name: "INSIIGHT INDEX PRO",
        tagline: "Premium Index & Market Intelligence",
        description:
          "A multi-layer index research ecosystem — global cues, market breadth, sector rotation, derivatives positioning and scenario engine.",
        tiers: [
          { name: "Start", duration: "1 Month", price: "₹55,000" },
          { name: "Advance", duration: "2 Months", price: "₹95,000" },
          { name: "Elite", duration: "3 Months", price: "₹1,51,000" },
        ],
      },
    ],
  },
  {
    title: "Stock Derivatives Research",
    tag: "F&O Segment",
    services: [
      {
        id: "stock-future",
        name: "INSIIGHT STOCK FUTURE",
        tagline: "Professional Stock Futures Research",
        description:
          "Individual stock-futures research — technical structure, Open Interest, sector strength and relative-strength observations.",
        tiers: [
          { name: "Prime", duration: "3 Months", price: "₹35,000" },
          { name: "Advance", duration: "6 Months", price: "₹70,000" },
          { name: "Elite", duration: "12 Months", price: "₹1,15,000" },
        ],
      },
      {
        id: "stock-future-pro",
        name: "INSIIGHT STOCK FUTURE PRO",
        tagline: "Premium Stock Futures Intelligence",
        description:
          "PRO stock-scanner matrix, futures positioning map, relative-strength champion board and event-to-price reaction research.",
        tiers: [
          { name: "PRO Prime", duration: "3 Months", price: "₹45,000" },
          { name: "PRO Advance", duration: "6 Months", price: "₹85,000" },
          { name: "PRO Elite", duration: "12 Months", price: "₹1,51,000" },
        ],
      },
      {
        id: "stock-options",
        name: "INSIIGHT STOCK OPTIONS",
        tagline: "Professional Stock Options Research",
        description:
          "High-liquidity stock-option research with option-chain intelligence, OI, IV and expiry-specific setups, entry, target and stop-loss guidance.",
        tiers: [
          { name: "Prime", duration: "3 Months", price: "₹45,000" },
          { name: "Advance", duration: "6 Months", price: "₹80,000" },
          { name: "Elite", duration: "12 Months", price: "₹1,35,000" },
        ],
      },
    ],
  },
  {
    title: "Commodities Research",
    tag: "MCX",
    services: [
      {
        id: "mcx-pro",
        name: "INSIIGHT MCX PRO",
        tagline: "Premium MCX Futures + Options Intelligence",
        description:
          "Gold, Silver, Crude Oil & Natural Gas — futures and options research combined with global cues, USD/INR context and a volatility regime engine.",
        tiers: [
          { name: "PRO Prime", duration: "3 Months", price: "₹55,000" },
          { name: "PRO Advance", duration: "6 Months", price: "₹95,000" },
          { name: "PRO Elite", duration: "12 Months", price: "₹1,51,000" },
        ],
      },
    ],
  },
];

const BIG_COMBO: Service = {
  id: "big-combo",
  name: "INSIIGHT BIG COMBO",
  tagline: "Complete Multi-Segment Research Ecosystem",
  description:
    "Equity + Index + Futures + Options + MCX — every desk combined into one integrated research subscription with a daily Big Combo Command Brief.",
  tiers: [{ name: "Combo", duration: "3 Months", price: "₹1,51,000" }],
};

const TRIAL_PACK: Service = {
  id: "trial-pack",
  name: "INSIIGHT TRIAL PACK",
  tagline: "One-Time Starter Trial",
  description:
    "Try any one eligible Alpha Insiight research desk for 7 days, delivered on dashboard + SMS, before committing to a full subscription.",
  tiers: [{ name: "Trial", duration: "7 Days", price: "₹5,900" }],
};

function TierChip({ tier }: { tier: Tier }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 font-mono text-xs">
      <div className="text-slate-500">
        {tier.name} · {tier.duration}
      </div>
      <div className="font-semibold text-slate-900">{tier.price} + GST</div>
    </div>
  );
}

function ServiceCard({ service, delay }: { service: Service; delay?: number }) {
  return (
    <div
      className="reveal group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg sm:p-6"
      style={{ "--reveal-delay": `${delay ?? 0}ms` } as React.CSSProperties}
    >
      <div className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-wide text-slate-500">{service.tagline}</span>
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">{service.name}</h3>
        <p className="text-sm font-light leading-snug text-slate-600">{service.description}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {service.tiers.map((t) => (
            <TierChip key={t.name} tier={t} />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="font-mono text-xs font-medium text-secondary">Research Service</span>
        <Link
          href="/contact"
          className="flex items-center gap-1 text-sm font-medium text-primary transition-all hover:text-on-primary-container group-hover:translate-x-0.5"
        >
          <span>Enquire</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="w-full bg-[#fbfbfd]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 sm:pt-10">
        <div className="mx-auto mb-5 flex max-w-4xl flex-col items-center space-y-2 text-center sm:mb-8 sm:space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-surface-container-low px-3.5 py-1 shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-slate-600 sm:text-xs">
              SEBI Reg. INH000020660 • Disciplined Advisory Desks
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            All 12 Research Services. Pure Focus.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-lg">
            Alpha Insiight is one of the innovative research service providers in
            India — technical, research-driven views delivered across Indian
            equities, derivatives, and commodities, under one roof.
          </p>
        </div>

        {/* Banner */}
        <div className="group relative h-72 w-full overflow-hidden rounded-3xl border border-dark-border bg-dark-surface shadow-xl sm:h-80 md:h-[340px]">
          <img
            src={HERO_IMAGE}
            alt="Institutional quantitative financial trading desks"
            className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-surface/90 via-dark-surface/30 to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-dark-border bg-dark-surface/85 px-3 py-1 font-mono text-xs text-cyan-accent backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-accent" /> Execution Engine
            </span>
            <span className="hidden rounded-full border border-dark-border bg-dark-surface/85 px-3 py-1 font-mono text-xs text-slate-300 backdrop-blur-md sm:inline-flex">
              12 Research Desks
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col justify-between gap-3 text-white sm:flex-row sm:items-center">
            <div>
              <span className="block font-mono text-xs uppercase tracking-wider text-cyan-accent">Institutional Architecture</span>
              <p className="text-sm font-light text-slate-300">Structured, tiered research across NSE, BSE &amp; MCX.</p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-4 py-2 text-sm font-medium text-dark-surface shadow-md transition-all hover:bg-slate-100 sm:self-auto"
            >
              <span>View Pricing Page</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Flagship: Big Combo */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="reveal group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-dark-border bg-dark-surface p-4 text-white shadow-lg sm:p-5 md:p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-2.5 py-0.5 font-mono text-xs font-semibold tracking-wider text-white">FLAGSHIP</span>
              <span className="rounded-full bg-dark-container px-2.5 py-0.5 font-mono text-xs text-cyan-accent">Omni-Asset Breadth</span>
              <span className="rounded-full bg-dark-container px-2.5 py-0.5 font-mono text-xs text-slate-300">Family Office Grade</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{BIG_COMBO.name}</h2>
            <p className="max-w-2xl text-sm font-light leading-relaxed text-slate-300">{BIG_COMBO.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {BIG_COMBO.tiers.map((t) => (
                <div key={t.name} className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 font-mono text-xs">
                  <div className="text-slate-400">{t.name} · {t.duration}</div>
                  <div className="font-semibold text-secondary-fixed">{t.price} + GST</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 mt-4 flex items-center justify-between border-t border-dark-border pt-6">
            <span className="font-mono text-xs text-slate-400">Equity • Index • Futures • Options • MCX</span>
            <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-accent transition-colors hover:text-white group-hover:translate-x-0.5">
              <span>Enquire</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category grids */}
      {CATEGORIES.map((cat, ci) => (
        <section key={cat.title} className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">{cat.tag}</span>
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{cat.title}</h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-surface-container-low px-3 py-1.5 font-mono text-xs text-slate-600">
              {cat.services.length} Desk{cat.services.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {cat.services.map((s, i) => (
              <ServiceCard key={s.id} service={s} delay={(ci * 2 + i) * 60} />
            ))}
          </div>
        </section>
      ))}

      {/* Trial Pack */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="reveal group flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900 p-4 text-white shadow-sm sm:p-6 md:flex-row md:items-center md:gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase text-cyan-accent">STARTER TRIAL</span>
              <span className="rounded-full border border-red-500/20 bg-primary/20 px-2 py-0.5 font-mono text-xs text-cyan-accent">One-Time</span>
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-white">{TRIAL_PACK.name}</h3>
            <p className="max-w-xl text-sm font-light leading-snug text-slate-300">{TRIAL_PACK.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-800 pt-4 md:mt-0 md:flex-col md:items-end md:border-t-0 md:pt-0">
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2.5 font-mono text-sm">
              <span className="font-semibold text-secondary-fixed">₹5,900 + GST</span>
              <span className="ml-2 text-slate-400">/ 7 Days</span>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-medium text-cyan-accent transition-all hover:text-white">
              <span>Start Trial</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Regulatory protocol strip */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200/70 bg-surface-container-low p-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span>SEBI Delivery Protocol:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["1. KYC & Suitability", "2. Transparent Agreement", "3. Live Dashboard + SMS Dispatch"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-sm text-slate-800 shadow-sm">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    <span className="font-mono text-xs">{step}</span>
                  </div>
                  {i < arr.length - 1 && <span className="hidden text-slate-300 sm:inline">→</span>}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            All services above are SEBI-registered research services. Prices exclude 18% GST. Investments and
            trading in securities, derivatives and commodities involve substantial market risk; past performance
            is not indicative of future results and no return, profit or accuracy is guaranteed or implied.
          </p>
        </div>
      </section>

      {/* Concierge CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-2 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-dark-border bg-dark-surface p-4 text-white shadow-xl sm:gap-6 sm:p-6 md:flex-row md:p-8">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-cyan-accent">Institutional Desk Concierge</span>
            <h3 className="text-xl font-semibold text-white sm:text-2xl">Need guidance choosing the right research desk?</h3>
            <p className="max-w-xl text-sm font-light text-slate-400">
              Speak with our principal desk analyst to evaluate which service matches your market focus and risk appetite.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="hidden text-right font-mono text-sm sm:block">
              <span className="block font-mono text-xs text-slate-400">Direct Priority Desk</span>
              <a className="font-medium text-white transition-colors hover:text-cyan-accent" href="tel:+919575519739">+91 95755 19739</a>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-dark-surface shadow-md transition-all hover:bg-slate-100"
            >
              Schedule Advisory Briefing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
