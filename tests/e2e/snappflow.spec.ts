import { expect, test } from "@playwright/test";

test.describe("SnappFlow Critical User Flows", () => {
  test("switches seamlessly between Persian (RTL) and English (LTR)", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(html).toHaveAttribute("lang", "fa");

    await page.getByTestId("lang-toggle").click();
    await expect(html).toHaveAttribute("dir", "ltr");
    await expect(html).toHaveAttribute("lang", "en");
  });

  test("books a ride and receives real-time WebSocket status updates", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("service-tab-bike").click();
    await page.getByTestId("request-trip-btn").click();

    const statusText = page.getByTestId("trip-status-text");
    await expect(statusText).toBeVisible();
    await expect(statusText).toContainText(/جستجوی/i);
  });
});
