import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getApiClient } from "../../test-utils/get-api-client.ts";
import { getRealConditionApiClient } from "../../test-utils/getRealConditionApiClient.ts";
import type { ITransaction, ISession } from "@ripste/db/mikro-orm";
import type { ITransactionMetrics } from "../../../src/routers/admin/domain/models/ITransactionMetrics.ts";

describe("Admin Router - Transactions Metrics", async () => {
	const { database } = await getApiClient();
	const {
		apiClient,
		data: { store, user },
	} = await getRealConditionApiClient();

	let session: ISession;

	beforeEach(async () => {
		session = await database.session.insert({
			userId: user.id,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60),
			token: `test-session-token-${Date.now()}`,
		});

		const allTransactions = await database.transaction.findMany({});
		for (const transaction of allTransactions) {
			await database.transaction.delete(transaction.id);
		}
	});

	afterEach(async () => {
		const allTransactions = await database.transaction.findMany({});
		for (const transaction of allTransactions) {
			await database.transaction.delete(transaction.id);
		}
	});

	describe("GET /admin/metrics/transactions", () => {
		it("should return transaction metrics with real data from database", async () => {
			const today = new Date();
			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);

			const transactions: ITransaction[] = [];

			for (let i = 0; i < 5; i++) {
				const transaction = await database.transaction.insert({
					reference: `test-success-${i}`,
					amount: 100 + i * 10,
					currency: "EUR",
					status: "completed",
					methodType: "checkout_page",
					metadata: null,
					storeId: store.id,
					sessionId: session.id,
				});
				transactions.push(transaction);
			}

			for (let i = 0; i < 2; i++) {
				const transaction = await database.transaction.insert({
					reference: `test-failed-${i}`,
					amount: 50,
					currency: "EUR",
					status: "failed",
					methodType: "checkout_page",
					metadata: null,
					storeId: store.id,
					sessionId: session.id,
				});
				transactions.push(transaction);
			}

			const pendingTransaction = await database.transaction.insert({
				reference: "test-pending",
				amount: 75,
				currency: "EUR",
				status: "processing",
				methodType: "checkout_page",
				metadata: null,
				storeId: store.id,
				sessionId: session.id,
			});
			transactions.push(pendingTransaction);

			const refundTransaction = transactions[0];
			if (refundTransaction) {
				await database.refund.insert({
					amount: 50,
					reason: "Customer request",
					status: "completed",
					processedAt: new Date(),
					transactionId: refundTransaction.id,
					initiatedByUserId: user.id,
				});
			}

			const res = await apiClient.admin.metrics.transactions.$get();

			expect(res.status).toBe(200);

			const metrics = (await res.json()) as ITransactionMetrics;

			expect(metrics.totalTransactions).toBe(8);
			expect(metrics.totalVolume).toBe(775);

			expect(metrics.transactionsByStatus.successful).toBe(5);
			expect(metrics.transactionsByStatus.failed).toBe(2);
			expect(metrics.transactionsByStatus.pending).toBe(1);

			expect(metrics.successRate).toBeCloseTo(62.5);
			expect(metrics.averageTransactionValue).toBeCloseTo(96.875);

			expect(metrics.transactionsByType.payment).toBe(7);
			expect(metrics.transactionsByType.refund).toBe(1);

			expect(Array.isArray(metrics.transactionsByDay)).toBe(true);
			expect(metrics.transactionsByDay.length).toBeGreaterThan(0);

			expect(metrics.todayTransactions).toBe(8);
			expect(metrics.todayVolume).toBe(775);
		});

		it("should return zero metrics when no transactions exist", async () => {
			const res = await apiClient.admin.metrics.transactions.$get();

			expect(res.status).toBe(200);

			const metrics = (await res.json()) as ITransactionMetrics;

			expect(metrics.totalTransactions).toBe(0);
			expect(metrics.totalVolume).toBe(0);
			expect(metrics.todayTransactions).toBe(0);
			expect(metrics.todayVolume).toBe(0);
			expect(metrics.successRate).toBe(0);
			expect(metrics.averageTransactionValue).toBe(0);
			expect(metrics.transactionsByStatus.successful).toBe(0);
			expect(metrics.transactionsByStatus.failed).toBe(0);
			expect(metrics.transactionsByStatus.pending).toBe(0);
			expect(metrics.transactionsByType.payment).toBe(0);
			expect(metrics.transactionsByType.refund).toBe(0);
		});

		it("should handle database errors gracefully", async () => {
			// Mock database to throw an error
			const originalFindMany = database.transaction.findMany;
			database.transaction.findMany = async () => {
				throw new Error("Database connection failed");
			};

			const res = await apiClient.admin.metrics.transactions.$get();

			expect(res.status).toBe(500);

			const errorResponse = (await res.json()) as { error: string };
			expect(errorResponse.error).toBe("Internal server error");

			// Restore original method
			database.transaction.findMany = originalFindMany;
		});
	});
});
