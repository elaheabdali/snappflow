"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Route,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { formatCurrency, formatNumber } from "@/lib/format";
import { fetchLiveSurgeQuote } from "@/lib/mock-api";
import { CITY_NODES } from "@/lib/routing";
import { tripSocket } from "@/lib/ws-simulator";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";
import type { RouteResult, ServiceTier } from "@/types";

interface TripBookingPanelProps {
  route: RouteResult | null;
}

const TIERS: ServiceTier[] = ["eco", "plus", "vip"];

export function TripBookingPanel({ route }: TripBookingPanelProps) {
  const { locale, t } = useLocale();
  const activeService = useSnappFlowStore((s) => s.activeService);
  const originNodeId = useSnappFlowStore((s) => s.originNodeId);
  const destinationNodeId = useSnappFlowStore((s) => s.destinationNodeId);
  const setOriginNodeId = useSnappFlowStore((s) => s.setOriginNodeId);
  const setDestinationNodeId = useSnappFlowStore((s) => s.setDestinationNodeId);
  const swapStations = useSnappFlowStore((s) => s.swapStations);
  const selectedTier = useSnappFlowStore((s) => s.selectedTier);
  const setSelectedTier = useSnappFlowStore((s) => s.setSelectedTier);
  const tripStatus = useSnappFlowStore((s) => s.tripStatus);
  const activeDriver = useSnappFlowStore((s) => s.activeDriver);
  const etaSeconds = useSnappFlowStore((s) => s.etaSeconds);
  const tripProgress = useSnappFlowStore((s) => s.tripProgress);
  const payWithBnpl = useSnappFlowStore((s) => s.payWithBnpl);
  const setPayWithBnpl = useSnappFlowStore((s) => s.setPayWithBnpl);
  const bnplCreditLimit = useSnappFlowStore((s) => s.bnplCreditLimit);
  const setBnplModalOpen = useSnappFlowStore((s) => s.setBnplModalOpen);
  const resetTrip = useSnappFlowStore((s) => s.resetTrip);

  const { data: surgeQuote } = useQuery({
    queryKey: ["surge-quote", activeService],
    queryFn: () => fetchLiveSurgeQuote(activeService),
    refetchInterval: 15_000,
  });

  const multiplier = surgeQuote?.multiplier ?? 1.0;
  const finalPriceToman = route
    ? Math.round((route.basePriceToman * multiplier) / 1000) * 1000
    : 0;

  const isBookingActive = tripStatus !== "idle" && tripStatus !== "completed";
  const hasEnoughCredit = bnplCreditLimit >= finalPriceToman;

  const handleRequestTrip = () => {
    if (!route) return;
    if (payWithBnpl && !hasEnoughCredit) {
      setBnplModalOpen(true);
      return;
    }
    tripSocket.startTripStream(route.pathNodes, route.estimatedMinutes);
  };

  const handleCancelTrip = () => {
    tripSocket.stopTripStream();
    resetTrip();
  };

  const activeStepIndex =
    tripStatus === "searching"
      ? 0
      : tripStatus === "driver_assigned" || tripStatus === "arriving"
      ? 1
      : tripStatus === "in_progress"
      ? 2
      : tripStatus === "completed"
      ? 3
      : -1;

  const timelineSteps = [
    t.status.steps.search,
    t.status.steps.assigned,
    t.status.steps.inProgress,
    t.status.steps.done,
  ];

  return (
    <aside
      aria-label={t.booking.bookNow}
      className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-xl"
    >
      <div className="relative flex flex-col gap-3">
        <div>
          <label
            htmlFor="origin-select"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            <MapPin className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <span>{t.booking.originLabel}</span>
          </label>
          <select
            id="origin-select"
            value={originNodeId}
            disabled={isBookingActive}
            onChange={(e) => setOriginNodeId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {CITY_NODES.map((n) => (
              <option key={n.id} value={n.id}>
                {locale === "fa" ? n.nameFa : n.nameEn}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swapStations}
          disabled={isBookingActive}
          aria-label={t.booking.swapAria}
          className="self-end rounded-lg border border-slate-200 bg-slate-100 p-1.5 text-slate-600 transition hover:border-brand-500/50 hover:text-slate-950 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
        </button>

        <div>
          <label
            htmlFor="dest-select"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            <MapPin className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" aria-hidden="true" />
            <span>{t.booking.destLabel}</span>
          </label>
          <select
            id="dest-select"
            value={destinationNodeId}
            disabled={isBookingActive}
            onChange={(e) => setDestinationNodeId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {CITY_NODES.map((n) => (
              <option key={n.id} value={n.id}>
                {locale === "fa" ? n.nameFa : n.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          {t.booking.tierLabel}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TIERS.map((tier) => {
            const isSelected = selectedTier === tier;
            const copy = t.booking.tiers[tier];
            return (
              <button
                key={tier}
                type="button"
                disabled={isBookingActive}
                onClick={() => setSelectedTier(tier)}
                className={`relative rounded-xl border p-2.5 text-start transition ${
                  isSelected
                    ? "border-brand-500/70 bg-brand-500/10 text-slate-950 dark:text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:border-slate-700"
                } disabled:opacity-60`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="tierActiveGlow"
                    className="absolute inset-0 rounded-xl ring-1 ring-brand-500/50"
                  />
                )}
                <div className="relative text-xs font-bold">{copy.name}</div>
                <div className="relative mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                  {copy.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {route && (
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-950/80">
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Route className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <span>{t.booking.distanceLabel}</span>
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {formatNumber(route.totalDistanceKm, locale)} {t.booking.kmUnit}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              <span>{t.booking.etaLabel}</span>
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {formatNumber(route.estimatedMinutes, locale)} {t.booking.minUnit}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <TrendingUp className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" aria-hidden="true" />
              <span>{t.booking.surgeLabel}</span>
            </div>
            <div className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-300">
              {multiplier > 1.1 ? t.booking.surgeHigh : t.booking.surgeNormal} (
              {formatNumber(multiplier, locale)}x)
            </div>
          </div>
        </div>
      )}

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-950/70">
        <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
          <CreditCard className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <span>{t.booking.payWithBnpl}</span>
        </span>
        <input
          type="checkbox"
          checked={payWithBnpl}
          disabled={isBookingActive}
          onChange={(e) => setPayWithBnpl(e.target.checked)}
          className="h-4 w-4 accent-brand-500"
        />
      </label>

      {payWithBnpl && !hasEnoughCredit && (
        <button
          type="button"
          onClick={() => setBnplModalOpen(true)}
          className="text-start text-xs font-semibold text-amber-600 underline underline-offset-4 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
        >
          {t.booking.insufficientBnpl}
        </button>
      )}

      <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-950">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {t.booking.totalPriceLabel}
        </span>
        <motion.span
          key={finalPriceToman}
          initial={{ opacity: 0.6, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-extrabold text-brand-600 dark:text-brand-400"
        >
          {formatCurrency(finalPriceToman, locale)}
        </motion.span>
      </div>

      {tripStatus === "idle" ? (
        <motion.button
          type="button"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRequestTrip}
          data-testid="request-trip-btn"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-3.5 text-sm font-extrabold text-slate-950 shadow-glow transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span>{t.booking.bookNow}</span>
        </motion.button>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tripStatus}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                {tripStatus === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-brand-600 dark:text-brand-400" aria-hidden="true" />
                )}
                <span data-testid="trip-status-text">{t.status[tripStatus]}</span>
              </div>
              {tripStatus === "in_progress" && (
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {Math.round(tripProgress * 100)}% • {formatNumber(etaSeconds, locale)}{" "}
                  {t.booking.secUnit}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {timelineSteps.map((stepLabel, idx) => {
                const done = idx <= activeStepIndex;
                return (
                  <div key={stepLabel} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full transition-colors ${
                        done ? "bg-brand-500" : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />
                    <div
                      className={`text-center text-[10px] font-medium ${
                        done ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {stepLabel}
                    </div>
                  </div>
                );
              })}
            </div>

            {activeDriver && (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900/90">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {locale === "fa" ? activeDriver.nameFa : activeDriver.nameEn}
                  </div>
                  <div className="mt-0.5 text-slate-500 dark:text-slate-400">
                    {locale === "fa" ? activeDriver.vehicleFa : activeDriver.vehicleEn} •{" "}
                    {activeDriver.plateNumber}
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2 py-1 font-bold text-amber-700 dark:text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-amber-500 dark:fill-amber-300" aria-hidden="true" />
                  <span>{formatNumber(activeDriver.rating, locale)}</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleCancelTrip}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {tripStatus === "completed" ? t.booking.newTrip : t.booking.cancelTrip}
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </aside>
  );
}