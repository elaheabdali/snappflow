"use client";

import { create } from "zustand";
import type {
  CompletedTripRecord,
  DriverInfo,
  Locale,
  Point2D,
  ServiceTier,
  ServiceType,
  ThemeMode,
  TripStatus,
} from "@/types";

interface SnappFlowState {
  locale: Locale;
  theme: ThemeMode;
  activeService: ServiceType;
  originNodeId: string;
  destinationNodeId: string;
  selectedTier: ServiceTier;
  isRoundTrip: boolean;
  promoCode: string;
  discountPercent: number;
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
  tripHistory: CompletedTripRecord[];

  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setActiveService: (service: ServiceType) => void;
  setOriginNodeId: (id: string) => void;
  setDestinationNodeId: (id: string) => void;
  swapStations: () => void;
  setSelectedTier: (tier: ServiceTier) => void;
  setRoundTrip: (value: boolean) => void;
  applyPromoCode: (code: string) => boolean;
  clearPromoCode: () => void;
  setPayWithBnpl: (value: boolean) => void;
  setBnplCreditLimit: (limit: number) => void;
  deductBnplCredit: (amount: number) => boolean;
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
  addTripHistory: (record: CompletedTripRecord) => void;
  resetTrip: () => void;
}

const VALID_PROMOS: Record<string, number> = {
  SNAPP20: 20,
  TEHRAN30: 30,
};

export const useSnappFlowStore = create<SnappFlowState>((set, get) => ({
  locale: "fa",
  theme: "dark",
  activeService: "ride",
  originNodeId: "vanak",
  destinationNodeId: "enghelab",
  selectedTier: "eco",
  isRoundTrip: false,
  promoCode: "",
  discountPercent: 0,
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
  tripHistory: [],

  setLocale: (locale) => set({ locale }),
  toggleLocale: () =>
    set((state) => ({ locale: state.locale === "fa" ? "en" : "fa" })),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
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
  setRoundTrip: (isRoundTrip) => set({ isRoundTrip }),
  applyPromoCode: (rawCode) => {
    const normalized = rawCode.trim().toUpperCase();
    const discount = VALID_PROMOS[normalized];
    if (!discount) return false;
    set({ promoCode: normalized, discountPercent: discount });
    return true;
  },
  clearPromoCode: () => set({ promoCode: "", discountPercent: 0 }),
  setPayWithBnpl: (payWithBnpl) => set({ payWithBnpl }),
  setBnplCreditLimit: (bnplCreditLimit) => set({ bnplCreditLimit }),
  deductBnplCredit: (amount) => {
    const current = get().bnplCreditLimit;
    if (current < amount) return false;
    set({ bnplCreditLimit: current - amount });
    return true;
  },
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
  addTripHistory: (record) =>
    set((state) => ({
      tripHistory: [record, ...state.tripHistory].slice(0, 5),
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