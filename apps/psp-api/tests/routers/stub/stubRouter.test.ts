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

	it("should accept 4242... for visa", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4242424242424242",
				},
			},
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept space-separated card numbers", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4242 4242 4242 4242",
				},
			},
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 4000... for visa", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "4000 0566 5566 5556",
				},
			},
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should reject invalid card number for visa", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "visa",
					cardNumber: "1234567890123456",
				},
			},
		});

		expect(res.status).toBe(400);
		expect(await res.json()).toEqual({
			error: "Invalid card number",
		});
	});

	it("should accept 5555... for mastercard", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "mastercard",
					cardNumber: "5555 5555 5555 4444",
				},
			},
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 2223... for mastercard", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "mastercard",
					cardNumber: "2223 0031 2200 3222",
				},
			},
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 5200... for mastercard", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "mastercard",
					cardNumber: "5200 8282 8282 8210",
				},
			},
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 5105... for mastercard", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "mastercard",
					cardNumber: "5105 1051 0510 5100",
				},
			},
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should reject invalid card number for mastercard", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "mastercard",
					cardNumber: "1234567890123456",
				},
			},
		});

		expect(res.status).toBe(400);
		expect(await res.json()).toEqual({
			error: "Invalid card number",
		});
	});

	it("should accept 3782... for amex", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "amex",
					cardNumber: "3782 822463 10005",
				},
			},
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should accept 3714... for amex", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "amex",
					cardNumber: "3714 496353 98431",
				},
			},
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "success",
		});
	});

	it("should reject invalid card number for amex", async () => {
		const res = await client.stub.pay.$post({
			json: {
				amount: 100,
				currency: "USD",
				paymentMethod: {
					type: "amex",
					cardNumber: "1234567890123456",
				},
			},
		});

		expect(res.status).toBe(400);
		expect(await res.json()).toEqual({
			error: "Invalid card number",
		});
	});
});
