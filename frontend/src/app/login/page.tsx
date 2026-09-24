"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api, setToken } from "@/lib/api";
import type { User } from "@/lib/types";

const RESEND_COOLDOWN = 45;

interface OTPResponse {
  message: string;
  dev_otp?: string | null;
}

interface TokenResponse {
  access_token: string;
  user: User;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post<OTPResponse>("/auth/otp/request", { phone });
      setDevOtp(res.dev_otp ?? null);
      setStep("otp");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post<TokenResponse>("/auth/otp/verify", {
        phone,
        code,
        name: name || undefined,
      });
      setToken(res.access_token);
      router.push(res.user.role === "admin" || res.user.role === "analyst" ? "/admin" : next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md">
      <h1 className="text-2xl font-bold text-navy-900">
        {step === "phone" ? "Login with your phone" : "Enter OTP"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {step === "phone"
          ? "We'll send a one-time password to your mobile number."
          : `OTP sent to +91 ${phone}`}
      </p>

      {step === "phone" ? (
        <form onSubmit={requestOtp} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="name">Name (first time only)</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Mobile Number</label>
            <input
              id="phone" required minLength={10} maxLength={15} inputMode="numeric"
              className="input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button type="submit" disabled={loading || cooldown > 0} className="btn-primary w-full">
            {loading ? "Sending…" : cooldown > 0 ? `Wait ${cooldown}s` : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="otp">6-digit OTP</label>
            <input
              id="otp" required minLength={6} maxLength={6} inputMode="numeric"
              className="input text-center text-2xl tracking-[0.5em]"
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
            />
          </div>
          {devOtp && (
            <p className="rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-800">
              Dev mode — your OTP is <span className="font-mono font-bold">{devOtp}</span>
            </p>
          )}
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Verifying…" : "Verify & Login"}
          </button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => setStep("phone")} className="text-slate-500 hover:text-navy-900">
              ← Change number
            </button>
            <button
              type="button"
              disabled={cooldown > 0 || loading}
              onClick={requestOtp}
              className="font-medium text-brand-600 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}
