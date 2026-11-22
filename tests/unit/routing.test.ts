import { describe, expect, it } from "vitest";
import { findOptimalRoute, interpolateAlongPath } from "@/lib/routing";

describe("Dijkstra Graph Routing & Pricing Engine", () => {
  it("computes optimal shortest path between Vanak and Bazaar", () => {
    const route = findOptimalRoute("vanak", "bazaar", "ride", "eco", 1.0);
    expect(route).not.toBeNull();
    expect(route?.pathIds[0]).toBe("vanak");
    expect(route?.pathIds[route.pathIds.length - 1]).toBe("bazaar");
    expect(route?.totalDistanceKm).toBeGreaterThan(0);
    expect(route?.basePriceToman).toBeGreaterThan(30000);
  });

  it("returns null when origin and destination are identical", () => {
    const route = findOptimalRoute("vanak", "vanak", "ride", "eco", 1.0);
    expect(route).toBeNull();
  });

  it("scales fare appropriately for VIP tier and surge multiplier", () => {
    const eco = findOptimalRoute("tajrish", "enghelab", "ride", "eco", 1.0);
    const vip = findOptimalRoute("tajrish", "enghelab", "ride", "vip", 1.5);
    expect(eco).not.toBeNull();
    expect(vip).not.toBeNull();
    expect(vip!.basePriceToman).toBeGreaterThan(eco!.basePriceToman);
  });

  it("interpolates driver position smoothly along route nodes", () => {
    const route = findOptimalRoute("vanak", "enghelab", "ride", "eco", 1.0)!;
    const start = interpolateAlongPath(route.pathNodes, 0);
    const end = interpolateAlongPath(route.pathNodes, 1);
    expect(start).toEqual({ x: route.pathNodes[0]!.x, y: route.pathNodes[0]!.y });
    expect(end).toEqual({
      x: route.pathNodes[route.pathNodes.length - 1]!.x,
      y: route.pathNodes[route.pathNodes.length - 1]!.y,
    });
  });
});
