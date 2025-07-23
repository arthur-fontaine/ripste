import { describe, expect, it, vi } from "vitest";

describe("Checkout Page", async () => {
  const { getFakeData } = await import("../../test-utils/getFakeData.ts");
  const { user, store, theme, transaction, checkoutPage } = await getFakeData();

  it("should show not found for invalid id", async () => {
    const { html, status } = await fetchHtml("/not-found-id");

    expect(status).toBe(404);
    expect(html).toContain("Checkout page not found");
  });

  it("should render checkout page with correct data", async () => {
    const { html, status } = await fetchHtml(`/${checkoutPage.uri}`);

    expect(status).toBe(200);
  });
});

async function fetchHtml(urlPathname: string) {
  const ret = await fetch(`http://localhost:3000${urlPathname}`)
  const html = await ret.text()
  return { html, status: ret.status, statusText: ret.statusText };
}
