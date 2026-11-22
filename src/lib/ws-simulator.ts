import { interpolateAlongPath } from "@/lib/routing";
import type { DriverInfo, MapNode, WsEventPayload } from "@/types";

type Listener = (event: WsEventPayload) => void;

const SAMPLE_DRIVERS: DriverInfo[] = [
  {
    id: "drv-101",
    nameFa: "امیرحسین رضایی",
    nameEn: "Amirhossein Rezaei",
    vehicleFa: "پژو ۲۰۷ سفید",
    vehicleEn: "Peugeot 207 White",
    plateNumber: "48 ب 712 ایران 11",
    rating: 4.92,
  },
  {
    id: "drv-204",
    nameFa: "سارا محمدی",
    nameEn: "Sara Mohammadi",
    vehicleFa: "تارا اتوماتیک نقره‌ای",
    vehicleEn: "Tara Automatic Silver",
    plateNumber: "22 ج 549 ایران 66",
    rating: 4.97,
  },
];

/**
 * Simulated WebSocket client streaming live trip states and GPS coordinates.
 */
class TripWebSocketSimulator {
  private listeners = new Set<Listener>();
  private timers: ReturnType<typeof setTimeout>[] = [];
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isConnected = false;

  connect() {
    if (this.isConnected) return;
    const timer = setTimeout(() => {
      this.isConnected = true;
      this.emit({ type: "WS_CONNECTED", latencyMs: 18 });
    }, 350);
    this.timers.push(timer);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.isConnected) {
      listener({ type: "WS_CONNECTED", latencyMs: 18 });
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(event: WsEventPayload) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  startTripStream(pathNodes: MapNode[], estimatedMinutes: number) {
    this.stopTripStream();
    const totalEtaSeconds = estimatedMinutes * 60;
    const driver = SAMPLE_DRIVERS[Math.floor(Math.random() * SAMPLE_DRIVERS.length)] ?? SAMPLE_DRIVERS[0]!;

    this.emit({
      type: "TRIP_STATUS",
      status: "searching",
      etaSeconds: totalEtaSeconds,
    });

    const t1 = setTimeout(() => {
      this.emit({
        type: "TRIP_STATUS",
        status: "driver_assigned",
        etaSeconds: totalEtaSeconds,
        driver,
      });
    }, 1300);

    const t2 = setTimeout(() => {
      this.emit({
        type: "TRIP_STATUS",
        status: "arriving",
        etaSeconds: totalEtaSeconds,
        driver,
      });
    }, 2600);

    const t3 = setTimeout(() => {
      this.emit({
        type: "TRIP_STATUS",
        status: "in_progress",
        etaSeconds: totalEtaSeconds,
        driver,
      });

      let step = 0;
      const totalSteps = 24;
      this.intervalId = setInterval(() => {
        step += 1;
        const progress = Math.min(1, step / totalSteps);
        const position = interpolateAlongPath(pathNodes, progress);
        const remainingSeconds = Math.max(0, Math.round(totalEtaSeconds * (1 - progress)));

        this.emit({
          type: "DRIVER_POSITION",
          position,
          progress,
          etaSeconds: remainingSeconds,
        });

        if (step >= totalSteps) {
          if (this.intervalId) clearInterval(this.intervalId);
          this.intervalId = null;
          this.emit({
            type: "TRIP_STATUS",
            status: "completed",
            etaSeconds: 0,
            driver,
          });
        }
      }, 260);
    }, 3900);

    this.timers.push(t1, t2, t3);
  }

  stopTripStream() {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
    this.timers = [];
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const tripSocket = new TripWebSocketSimulator();
