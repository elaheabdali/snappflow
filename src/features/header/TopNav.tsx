"use client";

import { motion } from "framer-motion";
import { Languages, ShieldCheck, Wallet, Wifi } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { formatCurrency } from "@/lib/format";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";

export function TopNav() {
  const { locale, t, toggleLocale } = useLocale();
  const wsConnected = useSnappFlowStore((s) => s.wsConnected);
  const wsLatencyMs = useSnappFlowStore((s) => s.wsLatencyMs);
  const bnplCreditLimit = useSnappFlowStore((s) => s.bnplCreditLimit);
  const setBnplModalOpen = useSnappFlowStore((s) => s.setBnplModalOpen);
  const setArchModalOpen = useSnappFlowStore((s) => s.setArchModalOpen);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-500/40">
            <svg
              viewBox="0 0 32 32"
              className="h-6 w-6 text-brand-400"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M6 22C10 10 22 22 26 10"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray="100"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
              <circle cx="6" cy="22" r="2.5" fill="currentColor" />
              <circle cx="26" cy="10" r="2.5" fill="#38bdf8" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white">
                {t.nav.brand}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  wsConnected
                    ? "bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30"
                    : "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    wsConnected ? "animate-pulse bg-brand-400" : "bg-amber-400"
                  }`}
                />
                <Wifi className="h-3 w-3" aria-hidden="true" />
                <span>
                  {wsConnected ? `${t.nav.wsLive} (${wsLatencyMs}ms)` : t.nav.wsConnecting}
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-400">{t.nav.tagline}</p>
          </div>
        </div>

        <nav aria-label="Primary actions" className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBnplModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-brand-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Wallet className="h-4 w-4 text-brand-400" aria-hidden="true" />
            <span>{t.nav.bnplWallet}:</span>
            <span className="font-bold text-brand-400">
              {formatCurrency(bnplCreditLimit, locale)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setArchModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-sky-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <ShieldCheck className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span className="hidden sm:inline">{t.nav.architectureBtn}</span>
          </button>

          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t.nav.langToggleAria}
            data-testid="lang-toggle"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Languages className="h-4 w-4 text-brand-400" aria-hidden="true" />
            <span>{locale === "fa" ? "EN" : "فارسی"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
