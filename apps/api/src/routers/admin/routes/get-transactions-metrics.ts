import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { database } from "../../../database.ts";
import type { ITransactionMetrics } from "../domain/models/ITransactionMetrics.ts";
import type { ITransactionStatusMetrics } from "../domain/models/ITransactionStatusMetrics.ts";
import type { ITransactionTypeMetrics } from "../domain/models/ITransactionTypeMetrics.ts";
import type { ITransactionDayMetric } from "../domain/models/ITransactionDayMetric.ts";

export const getTransactionMetricsRoute = createHonoRouter().get(
	"/transactions",
	protectedRouteMiddleware,
	async (c) => {
		try {
			const authUser = c.get("user");

			const user = await database.user.findOne(authUser.id);
			if (!user) {
				return c.json({ error: "User not found" }, 404);
			}

			if (!user.companyId) {
				return c.json({ error: "User has no associated company" }, 400);
			}

			const companyStores = await database.store.findMany({});
			const userCompanyStores = companyStores.filter(
				(store) => store.companyId === user.companyId,
			);

			if (userCompanyStores.length === 0) {
				const emptyMetrics: ITransactionMetrics = {
					totalTransactions: 0,
					totalVolume: 0,
					todayTransactions: 0,
					todayVolume: 0,
					successRate: 0,
					averageTransactionValue: 0,
					transactionsByDay: [],
					transactionsByStatus: {
						successful: 0,
						failed: 0,
						pending: 0,
					},
					transactionsByType: {
						payment: 0,
						refund: 0,
					},
				};
				return c.json(emptyMetrics);
			}

			const storeIds = userCompanyStores.map((store) => store.id);
			const allTransactions = await database.transaction.findMany({});
			const companyTransactions = allTransactions.filter((transaction) =>
				storeIds.includes(transaction.storeId),
			);

			const totalTransactions = companyTransactions.length;
			const totalVolume = companyTransactions.reduce(
				(sum, tx) => sum + tx.amount,
				0,
			);

			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);

			const todayTransactions = companyTransactions.filter(
				(tx) => tx.createdAt >= today && tx.createdAt < tomorrow,
			);
			const todayTransactionCount = todayTransactions.length;
			const todayVolume = todayTransactions.reduce(
				(sum, tx) => sum + tx.amount,
				0,
			);

			const successfulTransactions = companyTransactions.filter(
				(tx) => tx.status === "completed",
			);
			const successRate =
				totalTransactions > 0
					? (successfulTransactions.length / totalTransactions) * 100
					: 0;

			const averageTransactionValue =
				totalTransactions > 0 ? totalVolume / totalTransactions : 0;

			const transactionsByStatus: ITransactionStatusMetrics = {
				successful: companyTransactions.filter(
					(tx) => tx.status === "completed",
				).length,
				failed: companyTransactions.filter((tx) => tx.status === "failed")
					.length,
				pending: companyTransactions.filter((tx) => tx.status === "processing")
					.length,
			};

			const allRefunds = await database.refund.findMany({});

			const companyRefunds = allRefunds.filter((refund) =>
				companyTransactions.some((tx) => tx.id === refund.transactionId),
			);
			const refundCount = companyRefunds.length;

			const transactionsByType: ITransactionTypeMetrics = {
				payment: totalTransactions - refundCount,
				refund: refundCount,
			};

			const sevenDaysAgo = new Date();
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

			const recentTransactions = companyTransactions.filter(
				(tx) => tx.createdAt >= sevenDaysAgo,
			);

			const transactionsByDay: ITransactionDayMetric[] = [];

			for (let i = 6; i >= 0; i--) {
				const date = new Date();
				date.setDate(date.getDate() - i);
				const dateStr = date.toISOString().split("T")[0] || "";

				const dayStart = new Date(date);
				dayStart.setHours(0, 0, 0, 0);
				const dayEnd = new Date(date);
				dayEnd.setHours(23, 59, 59, 999);

				const dayTransactions = recentTransactions.filter(
					(tx) => tx.createdAt >= dayStart && tx.createdAt <= dayEnd,
				);

				transactionsByDay.push({
					date: dateStr,
					count: dayTransactions.length,
					volume: dayTransactions.reduce((sum, tx) => sum + tx.amount, 0),
				});
			}

			const metrics: ITransactionMetrics = {
				totalTransactions,
				totalVolume,
				todayTransactions: todayTransactionCount,
				todayVolume,
				successRate,
				averageTransactionValue,
				transactionsByDay,
				transactionsByStatus,
				transactionsByType,
			};

			return c.json(metrics, 200);
		} catch (error) {
			console.error("Error fetching transaction metrics:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);
