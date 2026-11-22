import type { MapEdge, MapNode, Point2D, RouteResult, ServiceTier, ServiceType } from "@/types";

export const CITY_NODES: MapNode[] = [
  { id: "tajrish", nameFa: "تجریش", nameEn: "Tajrish", x: 420, y: 65, districtFa: "شمال", districtEn: "North" },
  { id: "vanak", nameFa: "ونک", nameEn: "Vanak", x: 340, y: 165, districtFa: "مرکز-شمال", districtEn: "Mid-North" },
  { id: "saadat", nameFa: "سعادت‌آباد", nameEn: "Saadat Abad", x: 145, y: 145, districtFa: "شمال‌غرب", districtEn: "Northwest" },
  { id: "pasdaran", nameFa: "پاسداران", nameEn: "Pasdaran", x: 615, y: 155, districtFa: "شمال‌شرق", districtEn: "Northeast" },
  { id: "azadi", nameFa: "آزادی", nameEn: "Azadi", x: 115, y: 315, districtFa: "غرب", districtEn: "West" },
  { id: "enghelab", nameFa: "انقلاب", nameEn: "Enghelab", x: 355, y: 300, districtFa: "مرکز", districtEn: "Central" },
  { id: "tehranpars", nameFa: "تهران‌پارس", nameEn: "Tehranpars", x: 690, y: 295, districtFa: "شرق", districtEn: "East" },
  { id: "bazaar", nameFa: "بازار بزرگ", nameEn: "Grand Bazaar", x: 410, y: 425, districtFa: "جنوب", districtEn: "South" },
];

export const CITY_EDGES: MapEdge[] = [
  { from: "tajrish", to: "vanak", distanceKm: 5.4, trafficFactor: 1.2 },
  { from: "tajrish", to: "pasdaran", distanceKm: 6.1, trafficFactor: 1.3 },
  { from: "tajrish", to: "saadat", distanceKm: 7.2, trafficFactor: 1.1 },
  { from: "saadat", to: "vanak", distanceKm: 4.8, trafficFactor: 1.4 },
  { from: "saadat", to: "azadi", distanceKm: 6.9, trafficFactor: 1.2 },
  { from: "vanak", to: "pasdaran", distanceKm: 5.9, trafficFactor: 1.3 },
  { from: "vanak", to: "enghelab", distanceKm: 4.6, trafficFactor: 1.5 },
  { from: "pasdaran", to: "tehranpars", distanceKm: 5.5, trafficFactor: 1.1 },
  { from: "pasdaran", to: "enghelab", distanceKm: 7.4, trafficFactor: 1.4 },
  { from: "azadi", to: "enghelab", distanceKm: 5.2, trafficFactor: 1.3 },
  { from: "azadi", to: "bazaar", distanceKm: 8.1, trafficFactor: 1.2 },
  { from: "enghelab", to: "tehranpars", distanceKm: 9.0, trafficFactor: 1.4 },
  { from: "enghelab", to: "bazaar", distanceKm: 4.3, trafficFactor: 1.6 },
  { from: "tehranpars", to: "bazaar", distanceKm: 9.8, trafficFactor: 1.3 },
];

const NODE_MAP = new Map<string, MapNode>(CITY_NODES.map((n) => [n.id, n]));

/**
 * Computes the shortest weighted path between two city nodes using Dijkstra's algorithm.
 * Weight = distanceKm * trafficFactor.
 */
export function findOptimalRoute(
  originId: string,
  destId: string,
  service: ServiceType,
  tier: ServiceTier,
  surgeMultiplier = 1
): RouteResult | null {
  if (!NODE_MAP.has(originId) || !NODE_MAP.has(destId) || originId === destId) {
    return null;
  }

  const adjacency = new Map<string, Array<{ to: string; weight: number; dist: number }>>();
  for (const node of CITY_NODES) {
    adjacency.set(node.id, []);
  }
  for (const edge of CITY_EDGES) {
    const weight = edge.distanceKm * edge.trafficFactor;
    adjacency.get(edge.from)?.push({ to: edge.to, weight, dist: edge.distanceKm });
    adjacency.get(edge.to)?.push({ to: edge.from, weight, dist: edge.distanceKm });
  }

  const distances = new Map<string, number>();
  const rawKm = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>(CITY_NODES.map((n) => n.id));

  for (const node of CITY_NODES) {
    distances.set(node.id, Infinity);
    rawKm.set(node.id, 0);
    previous.set(node.id, null);
  }
  distances.set(originId, 0);

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let smallestDist = Infinity;

    for (const candidate of unvisited) {
      const d = distances.get(candidate) ?? Infinity;
      if (d < smallestDist) {
        smallestDist = d;
        currentId = candidate;
      }
    }

    if (currentId === null || smallestDist === Infinity || currentId === destId) {
      break;
    }

    unvisited.delete(currentId);
    const neighbors = adjacency.get(currentId) ?? [];

    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.to)) continue;
      const alt = smallestDist + neighbor.weight;
      if (alt < (distances.get(neighbor.to) ?? Infinity)) {
        distances.set(neighbor.to, alt);
        rawKm.set(neighbor.to, (rawKm.get(currentId) ?? 0) + neighbor.dist);
        previous.set(neighbor.to, currentId);
      }
    }
  }

  const pathIds: string[] = [];
  let step: string | null = destId;
  while (step !== null) {
    pathIds.unshift(step);
    step = previous.get(step) ?? null;
  }

  if (pathIds[0] !== originId) return null;

  const pathNodes: MapNode[] = [];
  for (const id of pathIds) {
    const found = NODE_MAP.get(id);
    if (found) pathNodes.push(found);
  }

  const totalDistanceKm = Number((rawKm.get(destId) ?? 0).toFixed(1));
  const weightedCost = distances.get(destId) ?? totalDistanceKm;

  const speedFactor = service === "bike" ? 2.1 : service === "cargo" ? 3.2 : 2.6;
  const estimatedMinutes = Math.max(4, Math.round(weightedCost * speedFactor));

  const serviceBase = service === "ride" ? 32000 : service === "bike" ? 24000 : 58000;
  const perKmRate = service === "ride" ? 9500 : service === "bike" ? 6800 : 14500;
  const tierMultiplier = tier === "eco" ? 1 : tier === "plus" ? 1.28 : 1.65;

  const rawPrice = (serviceBase + totalDistanceKm * perKmRate) * tierMultiplier * surgeMultiplier;
  const basePriceToman = Math.round(rawPrice / 1000) * 1000;

  return {
    pathIds,
    pathNodes,
    totalDistanceKm,
    estimatedMinutes,
    basePriceToman,
  };
}

/**
 * Interpolates a 2D point along a polyline of MapNodes for smooth 60fps driver telemetry.
 */
export function interpolateAlongPath(nodes: MapNode[], progress: number): Point2D {
  if (nodes.length === 0) return { x: 400, y: 250 };
  const first = nodes[0]!;
  if (nodes.length === 1 || progress <= 0) return { x: first.x, y: first.y };
  const last = nodes[nodes.length - 1]!;
  if (progress >= 1) return { x: last.x, y: last.y };

  const totalSegments = nodes.length - 1;
  const scaled = progress * totalSegments;
  const index = Math.min(Math.floor(scaled), totalSegments - 1);
  const localT = scaled - index;

  const a = nodes[index]!;
  const b = nodes[index + 1]!;

  return {
    x: a.x + (b.x - a.x) * localT,
    y: a.y + (b.y - a.y) * localT,
  };
}
