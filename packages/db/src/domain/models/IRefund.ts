import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { ITransactionTable } from "./ITransaction.ts";
import type { IUserTable } from "./IUser.ts";

export interface IRefundTable extends IBaseModel {
	amount: number;
	reason: string | null;
	status: "pending" | "processing" | "completed" | "failed";
	processedAt: Date | null;
	transaction: ISU.SingleReference<ITransactionTable, "transactionId", "id">;
	initiatedByUser: ISU.SingleReference<IUserTable | null, "initiatedByUserId", "id">;
}

export interface IRefund extends ISU.Selectable<IRefundTable> {}
export interface IInsertRefund extends ISU.Insertable<IRefundTable> {}
export interface IUpdateRefund extends ISU.Updateable<IRefundTable> {}

export const generateFakeRefund = createFakeGenerator<IRefund>(
	"IRefund",
	__filename
);

export const generateFakeInsertRefund = createFakeGenerator<IInsertRefund>(
	"IInsertRefund",
	__filename
);
