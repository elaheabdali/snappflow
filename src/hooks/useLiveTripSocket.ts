"use client";

import { useEffect } from "react";
import { tripSocket } from "@/lib/ws-simulator";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";

export function useLiveTripSocket() {
  const setWsConnected = useSnappFlowStore((s) => s.setWsConnected);
  const updateTripTelemetry = useSnappFlowStore((s) => s.updateTripTelemetry);

  useEffect(() => {
    tripSocket.connect();

    const unsubscribe = tripSocket.subscribe((event) => {
      switch (event.type) {
        case "WS_CONNECTED":
          setWsConnected(true, event.latencyMs);
          break;
        case "TRIP_STATUS":
          updateTripTelemetry({
            status: event.status,
            etaSeconds: event.etaSeconds,
            driver: event.driver ?? null,
          });
          break;
        case "DRIVER_POSITION":
          updateTripTelemetry({
            position: event.position,
            progress: event.progress,
            etaSeconds: event.etaSeconds,
          });
          break;
        default:
          break;
      }
    });

    return () => {
      unsubscribe();
      tripSocket.stopTripStream();
    };
  }, [setWsConnected, updateTripTelemetry]);
}
