export type Locale = "fa" | "en";

export type ServiceType = "ride" | "bike" | "cargo";

export type ServiceTier = "eco" | "plus" | "vip";

export type TripStatus =
  | "idle"
  | "searching"
  | "driver_assigned"
  | "arriving"
  | "in_progress"
  | "completed";

export interface MapNode {
  id: string;
  nameFa: string;
  nameEn: string;
  x: number; // SVG coordinate 0..800
  y: number; // SVG coordinate 0..500
  districtFa: string;
  districtEn: string;
}

export interface MapEdge {
  from: string;
  to: string;
  distanceKm: number;
  trafficFactor: number; // 1.0 = clear, 1.5 = moderate, 2.0 = heavy
}

export interface RouteResult {
  pathIds: string[];
  pathNodes: MapNode[];
  totalDistanceKm: number;
  estimatedMinutes: number;
  basePriceToman: number;
}

export interface DriverInfo {
  id: string;
  nameFa: string;
  nameEn: string;
  vehicleFa: string;
  vehicleEn: string;
  plateNumber: string;
  rating: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export type WsEventPayload =
  | { type: "WS_CONNECTED"; latencyMs: number }
  | { type: "TRIP_STATUS"; status: TripStatus; etaSeconds: number; driver?: DriverInfo }
  | { type: "DRIVER_POSITION"; position: Point2D; progress: number; etaSeconds: number }
  | { type: "SURGE_UPDATE"; multiplier: number };

export interface LiveNotification {
  id: string;
  messageFa: string;
  messageEn: string;
  timestamp: string;
}

export interface SurgeQuote {
  multiplier: number;
  activeDriversNearby: number;
  updatedAt: string;
}
