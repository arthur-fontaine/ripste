import { testClient } from "hono/testing";
import { describe, it, expect, vi } from "vitest";
import { z } from "zod/v4";
import { app } from "../../../src/app.ts";

vi.mock("interface-to-zod", () => ({
	interfaceToZod: () => z.any(),
}));

vi.mock("node:timers/promises", () => ({
	setTimeout: () => new Promise<void>((resolve) => resolve()),
}));

describe("Stub Router", () => {
	const client = testClient(app);

	async function pay(paymentMethod: { type: string; cardNumber: string }) {
		const submitPaymentResp = await client.stub["submit-payment"].$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					...paymentMethod,
					expiryDate: "12/2100",
					cvv: "123",
				},
			},
		});
		const submitPaymentRes = await submitPaymentResp.json();

		const paymentStatus = await client.stub.payments[":id"].status.$get({
			param: { id: submitPaymentRes.id },
		});

		return paymentStatus;
	}

	it("should accept 4242... for visa", async () => {
		const res = await pay({
			type: "visa",
			cardNumber: "4242424242424242",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept space-separated card numbers", async () => {
		const res = await pay({
			type: "visa",
			cardNumber: "4242 4242 4242 4242",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 4000... for visa", async () => {
		const res = await pay({
			type: "visa",
			cardNumber: "4000 0566 5566 5556",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should reject invalid card number for visa", async () => {
		const res = await pay({
			type: "visa",
			cardNumber: "1234567890123456",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			error: "Invalid card number",
			status: "failure",
		});
	});

	it("should accept 5555... for mastercard", async () => {
		const res = await pay({
			type: "mastercard",
			cardNumber: "5555 5555 5555 4444",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 2223... for mastercard", async () => {
		const res = await pay({
			type: "mastercard",
			cardNumber: "2223 0031 2200 3222",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 5200... for mastercard", async () => {
		const res = await pay({
			type: "mastercard",
			cardNumber: "5200 8282 8282 8210",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 5105... for mastercard", async () => {
		const res = await pay({
			type: "mastercard",
			cardNumber: "5105 1051 0510 5100",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should reject invalid card number for mastercard", async () => {
		const res = await pay({
			type: "mastercard",
			cardNumber: "1234567890123456",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			error: "Invalid card number",
			status: "failure",
		});
	});

	it("should accept 3782... for amex", async () => {
		const res = await pay({
			type: "amex",
			cardNumber: "3782 822463 10005",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 3714... for amex", async () => {
		const res = await pay({
			type: "amex",
			cardNumber: "3714 496353 98431",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should reject invalid card number for amex", async () => {
		const res = await pay({
			type: "amex",
			cardNumber: "1234567890123456",
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			error: "Invalid card number",
			status: "failure",
		});
	});

	it("should throw 404 for non-existent payment", async () => {
		const res = await client.stub.payments[":id"].status.$get({
			param: { id: "non-existent-id" },
		});

		expect(res.status).toBe(404);
		expect(await res.text()).toEqual(
			"Payment with id non-existent-id not found",
		);
	});

	it("should throw 400 if no cvv is provided", async () => {
		const res = await client.stub["submit-payment"].$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4242424242424242",
					cvv: "",
					expiryDate: "12/2100",
				},
			},
		});

		expect(res.status).toBe(400);
		expect(await res.text()).toContain("CVV is required");
	});

	it("should throw 400 if cvv is not a number", async () => {
		const res = await client.stub["submit-payment"].$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4242424242424242",
					cvv: "abc",
					expiryDate: "12/2100",
				},
			},
		});
	});

	it("should throw 400 if cvv is 2 digits", async () => {
		const res = await client.stub["submit-payment"].$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4242424242424242",
					cvv: "12",
					expiryDate: "12/2100",
				},
			},
		});

		expect(res.status).toBe(400);
		expect(await res.text()).toContain("CVV must be a 3 or 4 digit number");
	});

	it("should throw 400 if cvv is 5 digits", async () => {
		const res = await client.stub["submit-payment"].$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4242424242424242",
					cvv: "12345",
					expiryDate: "12/2100",
				},
			},
		});

		expect(res.status).toBe(400);
		expect(await res.text()).toContain("CVV must be a 3 or 4 digit number");
	});

	it("should throw 400 if no expiry date is provided", async () => {
		const res = await client.stub["submit-payment"].$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4242424242424242",
					cvv: "123",
					expiryDate: "",
				},
			},
		});

		expect(res.status).toBe(400);
		expect(await res.text()).toContain("Expiry date is required");
	});

	it("should throw 400 if invalid expiry date is provided", async () => {
		const res = await client.stub["submit-payment"].$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4242424242424242",
					cvv: "123",
					expiryDate: "12/025",
				},
			},
		});

		expect(res.status).toBe(400);
		expect(await res.text()).toContain("Expiry date must be in MM/YYYY format");
	});

	it("should throw 400 if expiry date is in the past", async () => {
		const res = await client.stub["submit-payment"].$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4242424242424242",
					cvv: "123",
					expiryDate: "01/2000",
				},
			},
		});

		expect(res.status).toBe(400);
		expect(await res.text()).toContain("Expiry date cannot be in the past");
	});
});
