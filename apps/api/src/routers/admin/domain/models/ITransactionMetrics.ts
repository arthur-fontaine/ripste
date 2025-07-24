import type { ITransactionDayMetric } from "./ITransactionDayMetric.ts";
import type { ITransactionStatusMetrics } from "./ITransactionStatusMetrics.ts";
import type { ITransactionTypeMetrics } from "./ITransactionTypeMetrics.ts";

export interface ITransactionMetrics {
	totalTransactions: number;
	totalVolume: number;
	todayTransactions: number;
	todayVolume: number;
	successRate: number;
	averageTransactionValue: number;
	transactionsByDay: ITransactionDayMetric[];
	transactionsByStatus: ITransactionStatusMetrics;
	transactionsByType: ITransactionTypeMetrics;
}
