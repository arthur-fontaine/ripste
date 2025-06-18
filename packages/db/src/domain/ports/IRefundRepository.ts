import type { IInsertRefund, IRefund } from "../models/IRefund.ts";

export interface IRefundRepository {
	findById(id: string): Promise<IRefund | null>;
	findMany(params: {
		transactionId?: string;
		initiatedByUserId?: string;
		status?: IRefund["status"];
	}): Promise<IRefund[]>;
	getTotalRefundedAmount(transactionId: string): Promise<number>;
	create(refundData: IInsertRefund): Promise<IRefund>;
	update(id: string, refundData: IInsertRefund): Promise<IRefund>;
	delete(id: string): Promise<void>;
}
