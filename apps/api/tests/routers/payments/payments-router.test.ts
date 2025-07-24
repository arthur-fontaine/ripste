import { describe, it, expect, afterAll } from "vitest";
import { serve } from "@hono/node-server";
import { getApiClient } from "../../test-utils/get-api-client.ts";
import { readBody } from "../../test-utils/readBody.ts";
import { getRealConditionApiClient } from "../../test-utils/getRealConditionApiClient.ts";
import { app } from "../../../../psp-api/src/app.ts";

const pspServer = serve({
	fetch: app.fetch,
	port: 3002,
});

afterAll(() => {
	pspServer.close();
});

describe("Payments Router", async () => {
	const { database } = await getApiClient();
	const {
		apiClient,
		data: { theme },
	} = await getRealConditionApiClient();

	describe("POST /payments/transactions", () => {
		it("should return 201 and a location header on successful payment creation", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(201);
			expect(res.headers.get("Location")).toBeDefined();
			expect(res.headers.get("Location")).not.toBeFalsy();
		});

		it("should return data with an id on successful payment creation", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});
			const body = readBody(await res.json());

			expect(body).toHaveProperty("data");
			expect(body.data).toHaveProperty("id");
		});

		it("should create a transaction in the database", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});
			const body = readBody(await res.json());
			const transactionId = body.data.id;

			const [transaction] = await database.transaction.findMany({
				id: transactionId,
			});
			expect(transaction).toBeDefined();
			expect(transaction?.amount).toBe(100);
			expect(transaction?.currency).toBe("USD");
		});

		it("should automatically uppercase the currency", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "usd",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});
			const body = readBody(await res.json());
			const transactionId = body.data.id;

			const [transaction] = await database.transaction.findMany({
				id: transactionId,
			});
			expect(transaction?.currency).toBe("USD");
		});

		it("should create a transaction event with type 'transaction_created'", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});
			const body = readBody(await res.json());
			const transactionId = body.data.id;

			const [transactionEvent] = await database.transactionEvent.findMany({
				transaction: { id: transactionId },
				eventData: { type: "transaction_created" },
			});

			expect(transactionEvent).toBeDefined();
		});

		it("should create an associated checkout page", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});
			const body = readBody(await res.json());
			const transactionId = body.data.id;

			const [checkout] = await database.checkoutPage.findMany({
				transaction: { id: transactionId },
			});

			expect(checkout).toBeDefined();
		});

		it("should have an associated session", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});
			const body = readBody(await res.json());
			const transactionId = body.data.id;

			const transaction = await database.transaction.findOne(transactionId);
			expect(transaction?.session).toBeDefined();
		});

		it("should have an associated store", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});
			const body = readBody(await res.json());
			const transactionId = body.data.id;

			const transaction = await database.transaction.findOne(transactionId);
			expect(transaction?.store).toBeDefined();
		});

		it("should return 400 if the amount is negative", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: -100,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(400);
			const body = readBody(await res.json());
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Amount must be a positive number.");
		});

		it("should return 400 if the amount is more than 1,000,000€", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 1000001,
					currency: "EUR",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(400);
			const body = readBody(await res.json());
			expect(body).toHaveProperty("error");
			expect(body.error).toBe(
				"Amount must not exceed 1,000,000€ or its equivalent in other currencies. Please contact support for larger transactions.",
			);
		});

		it("should pass if the amount is exactly 1,000,000€", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 1000000,
					currency: "EUR",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(201);
		});

		it("should return 400 if the amount is more than the equivalent of 1,000,000€ in other currencies", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 1000000,
					currency: "KWD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(400);
			const body = readBody(await res.json());
			expect(body).toHaveProperty("error");
			expect(body.error).toBe(
				"Amount must not exceed 1,000,000€ or its equivalent in other currencies. Please contact support for larger transactions.",
			);
		});

		it("should return 400 if the currency is not supported", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "XYZ",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(400);
			const body = readBody(await res.json());
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Unsupported currency.");
		});

		it("should return 400 if the amount decimal places exceed 2 for USD", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100.123,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(400);
			const body = readBody(await res.json());
			expect(body).toHaveProperty("error");
			expect(body.error).toBe(
				"Amount must have at most 2 decimal places for USD.",
			);
		});

		it("should return 400 if the amount decimal places exceed 0 for JPY", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100.5,
					currency: "JPY",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(400);
			const body = readBody(await res.json());
			expect(body).toHaveProperty("error");
			expect(body.error).toBe(
				"Amount must have at most 0 decimal places for JPY.",
			);
		});

		it("should return 400 if the amount decimal places exceed 3 for KWD", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100.1234,
					currency: "KWD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(400);
			const body = readBody(await res.json());
			expect(body).toHaveProperty("error");
			expect(body.error).toBe(
				"Amount must have at most 3 decimal places for KWD.",
			);
		});

		it("should pass if the amount decimal places are valid for KWD", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 100.123,
					currency: "KWD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(201);
		});

		it("should return 400 if the currency is BTC", async () => {
			const res = await apiClient.payments.transactions.$post({
				json: {
					amount: 0.001,
					currency: "BTC",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});

			expect(res.status).toBe(400);
			const body = readBody(await res.json());
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Cryptocurrency payments are not yet supported.");
		});

		// it("should return 400 if the amount decimal places exceed 8 for BTC", async () => {
		// 	const res = await client.payments.transactions.$post({
		// 		json: {
		// 			amount: 0.000000123,
		// 			currency: "BTC",
		// 		},
		// 	});

		// 	expect(res.status).toBe(400);
		// 	const body = readData(await res.json());
		// 	expect(body).toHaveProperty("error");
		// 	expect(body.error).toBe(
		// 		"Amount must have at most 8 decimal places for BTC.",
		// 	);
		// });
	});

	describe("POST /payments/submit-card-infos", () => {
		it("should mark the checkout page as completed", async () => {
			const transactionRes = await apiClient.payments.transactions.$post({
				json: {
					amount: 100,
					currency: "USD",
					reference: "test-transaction",
					metadata: null,
					checkoutPage: {
						title: "Test Checkout",
						themeId: theme.id,
					},
				},
			});
			const body = readBody(await transactionRes.json());
			const transactionId = body.data.id;

			const [checkoutPage] = await database.checkoutPage.findMany({
				transaction: { id: transactionId },
			});
			if (!checkoutPage) throw new Error("Checkout page not found");

			expect(checkoutPage.completedAt).toBeNull();

			const res = await apiClient.payments["submit-card-infos"].$post({
				json: {
					provider: "visa",
					cardNumber: "4242424242424242",
					holderName: "John Doe",
					month: 12,
					year: 2100,
					cvv: "123",
				},
				query: { uri: checkoutPage.uri },
			});

			expect(res.status).toBe(200);

			const newCheckoutPage = await database.checkoutPage.findOne(
				checkoutPage.id,
			);
			if (!newCheckoutPage)
				throw new Error("Checkout page not found after payment");

			expect(newCheckoutPage.completedAt).toBeDefined();
			expect(newCheckoutPage.completedAt).not.toBeNull();
			expect(newCheckoutPage.completedAt).toBeInstanceOf(Date);
		}, 12000);
	});
});
