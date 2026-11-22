export type Locale = "fa" | "en";

export type ThemeMode = "dark" | "light";

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
  x: number;
  y: number;
  districtFa: string;
  districtEn: string;
}

export interface MapEdge {
  from: string;
  to: string;
  distanceKm: number;
  trafficFactor: number;
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