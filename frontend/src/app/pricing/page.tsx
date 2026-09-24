import type { Metadata } from "next";
import { apiServer } from "@/lib/api";
import { FALLBACK_PLANS } from "@/lib/data";
import type { Plan } from "@/lib/types";
import PricingCatalog from "@/components/PricingCatalog";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent, flat-fee research subscription plans. No hidden charges, no profit-sharing.",
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const plans = await apiServer<Plan[]>("/plans", FALLBACK_PLANS);

  return (
    <div className="relative w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[360px] w-[850px] -translate-x-1/2 bg-gradient-to-b from-primary/10 via-cyan-accent/5 to-transparent blur-3xl" />

      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-14 pt-12 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          SEBI Reg. INH000020660
        </span>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-on-surface sm:text-5xl">
          Pricing &amp; Plans
        </h1>

        <p className="mt-3 max-w-xl text-sm text-on-surface-variant sm:text-base">
          Flat-fee research subscriptions. No hidden charges, no profit-sharing.
        </p>

        <PricingCatalog plans={plans} />

        <p className="mt-10 max-w-2xl text-xs text-outline">
          All fees are for research services only. Read our{" "}
          <a href="/disclaimer" className="underline hover:text-on-surface">
            disclaimer
          </a>{" "}
          before subscribing.
        </p>
      </section>
    </div>
  );
}
