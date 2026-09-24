import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Payment" };

export default function PaymentPage() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="container-site max-w-4xl">
        <h1 className="section-title">Our Payment Options</h1>
        <p className="mt-2 text-sm text-slate-500">Alpha Insiight</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Scan & Pay */}
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-red-700">
              UPI
            </span>
            <h2 className="mt-1 text-lg font-semibold text-navy-900">Scan &amp; Pay</h2>

            <div className="relative mt-5 h-48 w-48 overflow-hidden rounded-xl border border-slate-100">
              <Image src="/qr_code_clean.png" alt="Alpha Insiight UPI QR code" fill className="object-contain" />
            </div>

            <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">UPI ID</p>
            <p className="mt-1 select-all font-mono text-sm font-semibold text-navy-900">
              harshitkumar.ra@validkpay
            </p>

            <p className="mt-4 text-xs text-slate-400">BHIM · GPay · PhonePe · Paytm</p>
          </div>

          {/* Bank Transfer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-red-700">
              NEFT / IMPS
            </span>
            <h2 className="mt-1 text-lg font-semibold text-navy-900">Bank Transfer</h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-slate-500">Bank</dt>
                <dd className="mt-0.5 font-semibold text-navy-900">Kotak Mahindra Bank</dd>
              </div>
              <div>
                <dt className="text-slate-500">Account No.</dt>
                <dd className="mt-0.5 select-all font-mono font-semibold text-navy-900">9250107989</dd>
              </div>
              <div>
                <dt className="text-slate-500">IFSC Code</dt>
                <dd className="mt-0.5 select-all font-mono font-semibold text-navy-900">KKBK0005915</dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="mt-8 text-center text-sm leading-relaxed text-slate-600">
          Prefer to pay online instead? Every desk on our{" "}
          <a href="/pricing" className="font-medium text-red-700 hover:underline">
            pricing page
          </a>{" "}
          can be subscribed to directly via secure checkout — no manual transfer required.
        </p>
      </div>
    </div>
  );
}
