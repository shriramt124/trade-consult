"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Recommendation, Subscription, User } from "@/lib/types";

export default function DashboardOverview() {
  const [user, setUser] = useState<User | null>(null);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [liveCalls, setLiveCalls] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<User>("/auth/me", true).then(setUser).catch(() => {});
    api.get<Subscription[]>("/subscriptions/my", true).then(setSubs).catch(() => {});
    api
      .get<Recommendation[]>("/recommendations/live", true)
      .then(setLiveCalls)
      .catch((e) => setError(e.message));
  }, []);

  const active = subs.filter((s) => s.status === "active");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          Namaste{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here is your research overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">Active Plans</p>
          <p className="mt-1 text-3xl font-extrabold text-navy-900">{active.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Live Calls Right Now</p>
          <p className="mt-1 text-3xl font-extrabold text-navy-900">{liveCalls.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">KYC Status</p>
          <p className="mt-1 text-lg font-bold capitalize text-navy-900">
            {user?.kyc_status ?? "—"}
          </p>
        </div>
      </div>

      {active.length === 0 && (
        <div className="card border-brand-500/40 bg-brand-50">
          <h2 className="font-semibold text-navy-900">No active subscription yet</h2>
          <p className="mt-1 text-sm text-slate-600">
            Subscribe to a plan to unlock live calls on your dashboard.
          </p>
          <Link href="/pricing" className="btn-dark mt-4">View Plans</Link>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{error}</p>
      )}

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy-900">Latest live calls</h2>
          <Link href="/dashboard/recommendations" className="text-sm font-semibold text-brand-600">
            View all →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {liveCalls.slice(0, 3).map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div>
                <span className="font-semibold text-navy-900">{c.symbol}</span>
                <span className={`ml-2 ${c.action === "BUY" ? "badge-green" : "badge-red"}`}>
                  {c.action}
                </span>
              </div>
              <div className="text-right text-sm text-slate-600">
                Entry ₹{c.entry_price} · Target ₹{c.target_price} · SL ₹{c.stop_loss}
              </div>
            </div>
          ))}
          {liveCalls.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">
              No open calls at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
