"use client";

import { create } from "zustand";
import type {
  DriverInfo,
  Locale,
  Point2D,
  ServiceTier,
  ServiceType,
  TripStatus,
} from "@/types";

interface SnappFlowState {
  locale: Locale;
  activeService: ServiceType;
  originNodeId: string;
  destinationNodeId: string;
  selectedTier: ServiceTier;
  tripStatus: TripStatus;
  activeDriver: DriverInfo | null;
  driverPosition: Point2D | null;
  tripProgress: number;
  etaSeconds: number;
  wsConnected: boolean;
  wsLatencyMs: number;
  bnplCreditLimit: number;
  payWithBnpl: boolean;
  isBnplModalOpen: boolean;
  isArchModalOpen: boolean;

  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setActiveService: (service: ServiceType) => void;
  setOriginNodeId: (id: string) => void;
  setDestinationNodeId: (id: string) => void;
  swapStations: () => void;
  setSelectedTier: (tier: ServiceTier) => void;
  setPayWithBnpl: (value: boolean) => void;
  setBnplCreditLimit: (limit: number) => void;
  setBnplModalOpen: (open: boolean) => void;
  setArchModalOpen: (open: boolean) => void;
  setWsConnected: (connected: boolean, latencyMs?: number) => void;
  updateTripTelemetry: (payload: {
    status?: TripStatus;
    driver?: DriverInfo | null;
    position?: Point2D | null;
    progress?: number;
    etaSeconds?: number;
  }) => void;
  resetTrip: () => void;
}

export const useSnappFlowStore = create<SnappFlowState>((set) => ({
  locale: "fa",
  activeService: "ride",
  originNodeId: "vanak",
  destinationNodeId: "enghelab",
  selectedTier: "eco",
  tripStatus: "idle",
  activeDriver: null,
  driverPosition: null,
  tripProgress: 0,
  etaSeconds: 0,
  wsConnected: false,
  wsLatencyMs: 0,
  bnplCreditLimit: 500000,
  payWithBnpl: false,
  isBnplModalOpen: false,
  isArchModalOpen: false,

  setLocale: (locale) => set({ locale }),
  toggleLocale: () =>
    set((state) => ({ locale: state.locale === "fa" ? "en" : "fa" })),
  setActiveService: (activeService) => set({ activeService }),
  setOriginNodeId: (originNodeId) =>
    set((state) => ({
      originNodeId,
      destinationNodeId:
        state.destinationNodeId === originNodeId ? state.originNodeId : state.destinationNodeId,
    })),
  setDestinationNodeId: (destinationNodeId) =>
    set((state) => ({
      destinationNodeId,
      originNodeId:
        state.originNodeId === destinationNodeId ? state.destinationNodeId : state.originNodeId,
    })),
  swapStations: () =>
    set((state) => ({
      originNodeId: state.destinationNodeId,
      destinationNodeId: state.originNodeId,
    })),
  setSelectedTier: (selectedTier) => set({ selectedTier }),
  setPayWithBnpl: (payWithBnpl) => set({ payWithBnpl }),
  setBnplCreditLimit: (bnplCreditLimit) => set({ bnplCreditLimit }),
  setBnplModalOpen: (isBnplModalOpen) => set({ isBnplModalOpen }),
  setArchModalOpen: (isArchModalOpen) => set({ isArchModalOpen }),
  setWsConnected: (wsConnected, wsLatencyMs = 18) =>
    set({ wsConnected, wsLatencyMs }),
  updateTripTelemetry: (payload) =>
    set((state) => ({
      tripStatus: payload.status ?? state.tripStatus,
      activeDriver: payload.driver !== undefined ? payload.driver : state.activeDriver,
      driverPosition: payload.position !== undefined ? payload.position : state.driverPosition,
      tripProgress: payload.progress ?? state.tripProgress,
      etaSeconds: payload.etaSeconds ?? state.etaSeconds,
    })),
  resetTrip: () =>
    set({
      tripStatus: "idle",
      activeDriver: null,
      driverPosition: null,
      tripProgress: 0,
      etaSeconds: 0,
    }),
}));
