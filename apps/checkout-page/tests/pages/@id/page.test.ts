import { describe, expect, it } from "vitest";
import playwright from "playwright";

const browser = await playwright.chromium.launch({
  headless: true,
});
const context = await browser.newContext();
const page = await context.newPage();

describe("Checkout Page", async () => {
  const { getFakeData } = await import("../../test-utils/getFakeData.ts");
  const { checkoutPage } = await getFakeData();

  it("should show not found for invalid id", async () => {
    const { html, status } = await fetchHtml("/not-found-id");

    expect(status).toBe(404);
    expect(html).toContain("Checkout page not found");
  });

  it("should not throw an error for valid id", async () => {
    const { status } = await fetchHtml(`/${checkoutPage.uri}`);

    await page.goto(`http://localhost:3000/${checkoutPage.uri}`);

    expect(status).toBe(200);
    expect(page.innerHTML("body")).not.toContain("Error");
    expect(page.innerHTML("body")).not.toContain("error");
  });

  it("should render checkout page with correct data", async () => {
    const { status } = await fetchHtml(`/${checkoutPage.uri}`);
    if (status !== 200) throw new Error(`Expected status 200, got ${status}`);

    await page.goto(`http://localhost:3000/${checkoutPage.uri}`);

    const screenshot = await page.screenshot({ path: 'tests/pages/@id/__snapshots__/checkout-page.png' });
    expect(screenshot).toMatchSnapshot("checkout-page.png");
  });
});

async function fetchHtml(urlPathname: string) {
  const ret = await fetch(`http://localhost:3000${urlPathname}`)
  const html = await ret.text()
  return { html, status: ret.status, statusText: ret.statusText };
}
