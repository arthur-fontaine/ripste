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

		await page.goto(`http://localhost:3003/${checkoutPage.uri}`);

		expect(status).toBe(200);
		expect(page.innerHTML("body")).not.toContain("Error");
		expect(page.innerHTML("body")).not.toContain("error");
	});

	it("should render checkout page with correct data", async () => {
		const { status } = await fetchHtml(`/${checkoutPage.uri}`);
		if (status !== 200) throw new Error(`Expected status 200, got ${status}`);

		await page.goto(`http://localhost:3003/${checkoutPage.uri}`);

		const screenshot = await page.screenshot({
			path: "tests/pages/@id/__snapshots__/checkout-page.png",
		});
		if (!process.env["CI"]) {
			expect(screenshot).toMatchSnapshot("checkout-page.png");
		}
	});

	it("should fill and submit the payment form", async () => {
		await page.goto(`http://localhost:3003/${checkoutPage.uri}`);

		await page.fill("#card-name", "John Doe");
		await page.fill("#card-number", "4111 1111 1111 1111");
		await page.fill("#exp-month", "12");
		await page.fill("#exp-year", "2025");
		await page.fill("#cvv", "123");

		const logMock = vi.fn((message: string) => console.log(message));
		page.on("console", (msg) => logMock(msg.text()));

		await page.click("button[type='submit']");

		await page.waitForTimeout(100); // Wait for event to be processed

		expect(logMock).toHaveBeenCalledWith(
			'POST /payments/submit-card-infos {"json":{"provider":"visa","cardNumber":"4111 1111 1111 1111","holderName":"John Doe","month":12,"year":2025,"cvv":"123"},"param":{"uri":"random-id"}}',
		);
	});

	it("should redirect to success page on successful payment", async () => {
		await page.goto(`http://localhost:3003/${checkoutPage.uri}`);

		await page.fill("#card-name", "John Doe");
		await page.fill("#card-number", "4111 1111 1111 1111");
		await page.fill("#exp-month", "12");
		await page.fill("#exp-year", "2025");
		await page.fill("#cvv", "123");

		await page.click("button[type='submit']");

		await page.waitForURL(`http://localhost:3003/${checkoutPage.uri}/success`, {
			timeout: 5000,
		});

		expect(page.url()).toBe(
			`http://localhost:3003/${checkoutPage.uri}/success`,
		);

		const screenshot = await page.screenshot({
			path: "tests/pages/@id/__snapshots__/success-page.png",
		});
		if (!process.env["CI"]) {
			expect(screenshot).toMatchSnapshot("success-page.png");
		}
	}, 15000);
});

async function fetchHtml(urlPathname: string) {
	const ret = await fetch(`http://localhost:3003${urlPathname}`);
	const html = await ret.text();
	return { html, status: ret.status, statusText: ret.statusText };
}
