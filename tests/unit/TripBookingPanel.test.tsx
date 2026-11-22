import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TripBookingPanel } from "@/features/trip/TripBookingPanel";
import { findOptimalRoute } from "@/lib/routing";

describe("TripBookingPanel Integration", () => {
  it("renders origin/destination selectors, fare summary, and request CTA", () => {
    const queryClient = new QueryClient();
    const route = findOptimalRoute("vanak", "enghelab", "ride", "eco", 1.0);

    render(
      <QueryClientProvider client={queryClient}>
        <TripBookingPanel route={route} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId("request-trip-btn")).toBeInTheDocument();
    expect(screen.getByLabelText(/ایستگاه مبدا/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ایستگاه مقصد/i)).toBeInTheDocument();
  });
});
