"use client";

import { useEffect, useRef, useState } from "react";
import { api, WS_URL } from "@/lib/api";
import type { Recommendation } from "@/lib/types";

const STATUS_STYLE: Record<string, string> = {
  open: "badge-amber",
  target_hit: "badge-green",
  sl_hit: "badge-red",
  closed: "badge-slate",
};

export default function LiveCallsPage() {
  const [calls, setCalls] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");
  const [wsLive, setWsLive] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Initial load: open calls + recent history merged
  useEffect(() => {
    api
      .get<Recommendation[]>("/recommendations/history", true)
      .then(setCalls)
      .catch((e) => setError(e.message));
  }, []);

  // Real-time updates: new calls arrive instantly, closed calls update in place
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setWsLive(true);
    ws.onclose = () => setWsLive(false);
    ws.onerror = () => setWsLive(false);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "new_call") {
          setCalls((prev) => [msg.data as Recommendation, ...prev]);
        } else if (msg.type === "call_closed") {
          const updated = msg.data as Recommendation;
          setCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }
      } catch {
        /* ignore malformed frames */
      }
    };

    // Keep-alive ping so proxies don't drop the socket
    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send("ping");
    }, 30000);

    return () => {
      clearInterval(ping);
      ws.close();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Live Calls</h1>
          <p className="mt-1 text-sm text-slate-500">
            Calls for your subscribed plans, updated in real time.
          </p>
        </div>
        <span className={wsLive ? "badge-green" : "badge-slate"}>
          {wsLive ? "● Live" : "○ Connecting"}
        </span>
      </div>

      {error && (
        <div className="card border-amber-300 bg-amber-50">
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {calls.map((c) => (
          <div key={c.id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-navy-900">{c.symbol}</span>
                <span className={c.action === "BUY" ? "badge-green" : "badge-red"}>
                  {c.action}
                </span>
                <span className={STATUS_STYLE[c.status]}>
                  {c.status.replace("_", " ")}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {new Date(c.created_at).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Entry", value: c.entry_price },
                { label: "Target", value: c.target_price },
                { label: "Stop-Loss", value: c.stop_loss },
                { label: "Exit", value: c.exit_price ?? "—" },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-xs uppercase tracking-wider text-slate-400">{f.label}</p>
                  <p className="mt-0.5 font-semibold text-navy-900">
                    {f.value === "—" ? "—" : `₹${f.value}`}
                  </p>
                </div>
              ))}
            </div>

            {c.notes && (
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{c.notes}</p>
            )}
          </div>
        ))}

        {calls.length === 0 && !error && (
          <div className="card py-12 text-center text-sm text-slate-500">
            No calls yet. New recommendations will appear here instantly.
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Recommendations are for personal use only and must not be redistributed.
        Investment in securities market is subject to market risks.
      </p>
    </div>
  );
}
