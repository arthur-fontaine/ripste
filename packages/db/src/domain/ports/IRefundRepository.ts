import type { IInsertRefund, IRefund } from "../models/IRefund.ts";

export interface IRefundRepository {
	findById(id: string): Promise<IRefund | null>;
	findByTransactionId(transactionId: string): Promise<IRefund[]>;
	findByInitiatedByUserId(userId: string): Promise<IRefund[]>;
	findByStatus(status: IRefund["status"]): Promise<IRefund[]>;
	findPendingRefunds(): Promise<IRefund[]>;
	findByTransactionAndStatus(
		transactionId: string,
		status: IRefund["status"],
	): Promise<IRefund[]>;
	getTotalRefundedAmount(transactionId: string): Promise<number>;
	create(refundData: IInsertRefund): Promise<IRefund>;
	update(id: string, refundData: IInsertRefund): Promise<IRefund>;
	delete(id: string): Promise<void>;
}
