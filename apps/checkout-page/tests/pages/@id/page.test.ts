import { describe, expect, it, vi } from "vitest";
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

  it("should fill and submit the payment form", async () => {
    console.log("Going to checkout page for filling form");
    await page.goto(`http://localhost:3000/${checkoutPage.uri}`);

    console.log("Filling the payment form");
    await page.fill("#card-name", "John Doe");
    await page.fill("#card-number", "4111 1111 1111 1111");
    await page.fill("#exp-month", "12");
    await page.fill("#exp-year", "2025");
    await page.fill("#cvv", "123");
    console.log("Input fields filled");

    const logMock = vi.fn((message: string) => console.log(message));
    page.on("console", (msg) => logMock(msg.text()));

    console.log("Submitting the form");
    await page.click("button[type='submit']");
    console.log("Form submitted");

    await page.waitForTimeout(100); // Wait for event to be processed

    expect(logMock).toHaveBeenCalledWith("POST /payments/submit-card-infos {\"json\":{\"provider\":\"visa\",\"cardNumber\":\"4111 1111 1111 1111\",\"holderName\":\"John Doe\",\"month\":12,\"year\":2025,\"cvv\":\"123\"},\"param\":{\"uri\":\"random-id\"}}");
  });
});

async function fetchHtml(urlPathname: string) {
  const ret = await fetch(`http://localhost:3000${urlPathname}`)
  const html = await ret.text()
  return { html, status: ret.status, statusText: ret.statusText };
}
