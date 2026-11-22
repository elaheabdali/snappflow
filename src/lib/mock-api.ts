import type { SurgeQuote } from "@/types";

export async function fetchLiveSurgeQuote(service: string): Promise<SurgeQuote> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const baseMultiplier = service === "cargo" ? 1.15 : service === "bike" ? 1.05 : 1.1;
  return {
    multiplier: baseMultiplier,
    activeDriversNearby: service === "ride" ? 14 : service === "bike" ? 22 : 6,
    updatedAt: new Date().toISOString(),
  };
}

export interface BnplSubmitPayload {
  fullName: string;
  nationalId: string;
  phone: string;
  monthlyIncome: number;
  requestedLimit: number;
}

export async function submitBnplApplication(
  payload: BnplSubmitPayload
): Promise<{ approvedLimit: number; referenceCode: string }> {
  await new Promise((resolve) => setTimeout(resolve, 650));
  return {
    approvedLimit: payload.requestedLimit,
    referenceCode: `SNPP-${Math.floor(100000 + Math.random() * 900000)}`,
  };
}
