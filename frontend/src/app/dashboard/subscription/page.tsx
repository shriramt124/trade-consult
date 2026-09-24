"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/data";
import type { Subscription } from "@/lib/types";

const STATUS_STYLE: Record<string, string> = {
  active: "badge-green",
  pending: "badge-amber",
  expired: "badge-slate",
  cancelled: "badge-red",
};

export default function SubscriptionPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Subscription[]>("/subscriptions/my", true)
      .then(setSubs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">My Subscription</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your research plans.</p>
        </div>
        <Link href="/pricing" className="btn-primary">Add Plan</Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : subs.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-sm text-slate-500">You have no subscriptions yet.</p>
          <Link href="/pricing" className="btn-dark mt-4">Browse Plans</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subs.map((s) => (
            <div key={s.id} className="card flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-navy-900">{s.plan.name}</h2>
                  <span className={STATUS_STYLE[s.status] ?? "badge-slate"}>{s.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {formatINR(s.plan.price_paise)} / {s.plan.duration_days} days
                </p>
              </div>
              <div className="text-right text-sm text-slate-600">
                {s.status === "active" && s.ends_at ? (
                  <>
                    <p>Valid until</p>
                    <p className="font-semibold text-navy-900">
                      {new Date(s.ends_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </>
                ) : s.status === "pending" ? (
                  <Link href="/pricing" className="font-semibold text-brand-600">
                    Complete payment →
                  </Link>
                ) : (
                  <Link href="/pricing" className="font-semibold text-brand-600">
                    Renew →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
