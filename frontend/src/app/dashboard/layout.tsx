"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/recommendations", label: "Live Calls" },
  { href: "/dashboard/subscription", label: "My Subscription" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/login?next=${pathname}`);
    } else {
      setReady(true);
    }
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <div className="container-site flex flex-col gap-8 py-10 lg:flex-row">
        <aside className="lg:w-56">
          <nav className="card flex gap-2 p-3 lg:flex-col">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === n.href
                    ? "bg-navy-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
