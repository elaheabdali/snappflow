"use client";

import { motion } from "framer-motion";
import { Bike, Car, Package } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";
import type { ServiceType } from "@/types";

const SERVICES: Array<{
  id: ServiceType;
  icon: typeof Car;
}> = [
  { id: "ride", icon: Car },
  { id: "bike", icon: Bike },
  { id: "cargo", icon: Package },
];

export function ServiceSwitcher() {
  const { t } = useLocale();
  const activeService = useSnappFlowStore((s) => s.activeService);
  const setActiveService = useSnappFlowStore((s) => s.setActiveService);
  const tripStatus = useSnappFlowStore((s) => s.tripStatus);

  const isLocked = tripStatus !== "idle" && tripStatus !== "completed";

  return (
    <div
      role="tablist"
      aria-label="SnappFlow services"
      className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-1.5"
    >
      {SERVICES.map(({ id, icon: Icon }) => {
        const isActive = activeService === id;
        const copy = t.services[id];

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={isLocked}
            data-testid={`service-tab-${id}`}
            onClick={() => setActiveService(id)}
            className={`relative flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:flex-row sm:justify-center sm:gap-2.5 sm:text-start ${
              isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
            } ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeServicePill"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-brand-500/20 ring-1 ring-brand-500/60"
              />
            )}
            <Icon
              className={`relative z-10 h-5 w-5 shrink-0 ${
                isActive ? "text-brand-400" : "text-slate-400"
              }`}
              aria-hidden="true"
            />
            <div className="relative z-10">
              <div className="text-xs font-bold sm:text-sm">{copy.title}</div>
              <div className="hidden text-[11px] text-slate-400 md:block">
                {copy.subtitle}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
