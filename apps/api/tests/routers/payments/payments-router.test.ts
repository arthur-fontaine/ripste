import { describe, it, expect } from "vitest";
import { getApiClient } from "../../test-utils/get-api-client.ts";

describe("Payments Router", async () => {
	const { app, database } = await getApiClient();

	await app.fetch(
		new Request("https://_/auth/sign-up/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "NFKJDNSK",
				email: "fndknfkds@gmail.com",
				password: "fneksdKNKNKdsmks.329",
			}),
		}),
	);
	const [u] = await database.user.findMany({ email: "fndknfkds@gmail.com" });
	if (!u) throw new Error("User not found");
	await database.user.update(u.id, { emailVerified: true });
	const store = await database.store.insert({
		name: "Test Store",
		slug: "test-store",
		contactEmail: "test@example.com",
		companyId: null,
		contactPhone: null,
	});
	await database.storeMember.insert({
		storeId: store.id,
		userId: u.id,
		permissionLevel: "owner",
	});
	const theme = await database.checkoutTheme.insert({
		name: "Default Theme",
		storeId: store.id,
		version: 1,
	});
	const signInResponse = await app.fetch(
		new Request("https://_/auth/sign-in/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: "fndknfkds@gmail.com",
				password: "fneksdKNKNKdsmks.329",
			}),
		}),
	);
	const cookie = signInResponse.headers.get("set-cookie");
	if (!cookie) {
		throw new Error("Missing cookie");
	}
	const { apiClient } = await getApiClient({ cookie });

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
			const body = await res.json();

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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
			const body = await res.json();
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
		// 	const body = await res.json();
		// 	expect(body).toHaveProperty("error");
		// 	expect(body.error).toBe(
		// 		"Amount must have at most 8 decimal places for BTC.",
		// 	);
		// });
	});
});
