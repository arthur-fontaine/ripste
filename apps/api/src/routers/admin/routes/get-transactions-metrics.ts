import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";

export const getTransactionMetricsRoute = createHonoRouter().get(
	"/transactions",
	async (c) => {
		try {
			const metrics = {
				totalTransactions: 12847,
				totalVolume: 2456789.5,
				todayTransactions: 342,
				todayVolume: 45230.75,
				successRate: 98.5,
				averageTransactionValue: 191.23,
				transactionsByDay: [
					{ date: "2025-07-18", count: 298, volume: 39240.2 },
					{ date: "2025-07-19", count: 356, volume: 47820.5 },
					{ date: "2025-07-20", count: 421, volume: 52360.8 },
					{ date: "2025-07-21", count: 389, volume: 48950.3 },
					{ date: "2025-07-22", count: 445, volume: 56780.9 },
					{ date: "2025-07-23", count: 398, volume: 51240.7 },
					{ date: "2025-07-24", count: 342, volume: 45230.75 },
				],
				transactionsByStatus: {
					successful: 12653,
					failed: 148,
					pending: 46,
				},
				transactionsByType: {
					payment: 8920,
					refund: 1205,
				},
				averageProcessingTime: 2.3,
			};

			return c.json(metrics);
		} catch (error) {
			console.error("Error fetching transaction metrics:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);
