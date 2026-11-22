"use client";

import { motion } from "framer-motion";
import { Navigation } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { CITY_EDGES, CITY_NODES } from "@/lib/routing";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";
import type { RouteResult } from "@/types";

interface InteractiveMapProps {
  route: RouteResult | null;
}

export function InteractiveMap({ route }: InteractiveMapProps) {
  const { locale, t } = useLocale();
  const originNodeId = useSnappFlowStore((s) => s.originNodeId);
  const destinationNodeId = useSnappFlowStore((s) => s.destinationNodeId);
  const setOriginNodeId = useSnappFlowStore((s) => s.setOriginNodeId);
  const setDestinationNodeId = useSnappFlowStore((s) => s.setDestinationNodeId);
  const driverPosition = useSnappFlowStore((s) => s.driverPosition);
  const tripStatus = useSnappFlowStore((s) => s.tripStatus);

  const isLocked = tripStatus !== "idle" && tripStatus !== "completed";

  const nodeMap = new Map(CITY_NODES.map((n) => [n.id, n]));

  const routePathD =
    route && route.pathNodes.length >= 2
      ? route.pathNodes
          .map((node, idx) => `${idx === 0 ? "M" : "L"} ${node.x} ${node.y}`)
          .join(" ")
      : "";

  const handleNodeClick = (nodeId: string) => {
    if (isLocked) return;
    if (nodeId === originNodeId || nodeId === destinationNodeId) return;
    setDestinationNodeId(nodeId);
  };

  return (
    <section
      aria-label={t.map.title}
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/75 p-4 shadow-xl sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-white sm:text-base">
            <Navigation className="h-4 w-4 text-brand-400" aria-hidden="true" />
            <span>{t.map.title}</span>
          </h2>
          <p className="text-xs text-slate-400">{t.map.subtitle}</p>
        </div>
        <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
          {t.map.graphAlgoBadge}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950">
        <svg
          viewBox="0 0 800 500"
          className="h-auto w-full select-none"
          role="img"
          aria-label={t.map.title}
        >
          <defs>
            <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(148, 163, 184, 0.07)"
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d170" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          <rect width="800" height="500" fill="url(#cityGrid)" />

          {/* Road network edges */}
          {CITY_EDGES.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(100, 116, 139, 0.3)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}

          {/* Animated optimal Dijkstra route */}
          {routePathD && (
            <motion.path
              key={routePathD}
              d={routePathD}
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              strokeDasharray="100"
              initial={{ strokeDashoffset: 100, opacity: 0.4 }}
              animate={{ strokeDashoffset: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
            />
          )}

          {/* City Nodes */}
          {CITY_NODES.map((node) => {
            const isOrigin = node.id === originNodeId;
            const isDest = node.id === destinationNodeId;
            const label = locale === "fa" ? node.nameFa : node.nameEn;

            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (!isLocked && node.id !== destinationNodeId) {
                    setOriginNodeId(node.id);
                  }
                }}
                className={isLocked ? "cursor-default" : "cursor-pointer"}
                role="button"
                tabIndex={0}
                aria-label={label}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNodeClick(node.id);
                  }
                }}
              >
                {(isOrigin || isDest) && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={18}
                    fill={isOrigin ? "rgba(0, 209, 112, 0.22)" : "rgba(56, 189, 248, 0.22)"}
                    animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0.25, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isOrigin || isDest ? 9 : 6.5}
                  fill={isOrigin ? "#00d170" : isDest ? "#38bdf8" : "#1e293b"}
                  stroke={isOrigin || isDest ? "#ffffff" : "#64748b"}
                  strokeWidth="2.5"
                />

                <rect
                  x={node.x - 46}
                  y={node.y + 14}
                  width="92"
                  height="22"
                  rx="6"
                  fill="rgba(15, 23, 42, 0.88)"
                  stroke={
                    isOrigin
                      ? "rgba(0, 209, 112, 0.6)"
                      : isDest
                      ? "rgba(56, 189, 248, 0.6)"
                      : "rgba(51, 65, 85, 0.7)"
                  }
                  strokeWidth="1"
                />
                <text
                  x={node.x}
                  y={node.y + 28.5}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight={isOrigin || isDest ? "700" : "500"}
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Real-time WebSocket Driver Telemetry Marker */}
          {driverPosition && tripStatus === "in_progress" && (
            <motion.g
              animate={{ x: driverPosition.x, y: driverPosition.y }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
            >
              <circle r="15" fill="rgba(250, 204, 21, 0.25)" />
              <circle r="8" fill="#facc15" stroke="#0f172a" strokeWidth="2.5" />
            </motion.g>
          )}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>{t.map.clickHint}</span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
            {t.map.originBadge}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            {t.map.destBadge}
          </span>
        </div>
      </div>
    </section>
  );
}
