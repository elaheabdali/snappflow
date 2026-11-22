"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useLiveTripSocket } from "@/hooks/useLiveTripSocket";
import { useLocale } from "@/hooks/useLocale";
import { findOptimalRoute } from "@/lib/routing";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";
import { TopNav } from "@/features/header/TopNav";
import { ServiceSwitcher } from "@/features/super-app/ServiceSwitcher";
import { TripBookingPanel } from "@/features/trip/TripBookingPanel";

const InteractiveMap = dynamic(
  () => import("@/features/map/InteractiveMap").then((m) => m.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60" />
    ),
  }
);

const BnplCreditModal = dynamic(
  () => import("@/features/bnpl/BnplCreditModal").then((m) => m.BnplCreditModal),
  { ssr: false }
);

const EngineeringShowcase = dynamic(
  () =>
    import("@/features/architecture/EngineeringShowcase").then(
      (m) => m.EngineeringShowcase
    ),
  { ssr: false }
);

export function SnappFlowShell() {
  useLocale();
  useLiveTripSocket();

  const activeService = useSnappFlowStore((s) => s.activeService);
  const originNodeId = useSnappFlowStore((s) => s.originNodeId);
  const destinationNodeId = useSnappFlowStore((s) => s.destinationNodeId);
  const selectedTier = useSnappFlowStore((s) => s.selectedTier);

  const route = useMemo(
    () =>
      findOptimalRoute(
        originNodeId,
        destinationNodeId,
        activeService,
        selectedTier
      ),
    [originNodeId, destinationNodeId, activeService, selectedTier]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
        <ServiceSwitcher />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <InteractiveMap route={route} />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <TripBookingPanel route={route} />
          </div>
        </div>
      </main>

      <BnplCreditModal />
      <EngineeringShowcase />
    </div>
  );
}
