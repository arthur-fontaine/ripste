import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IPaymentMethodTable } from "./IPaymentMethod.ts";
import type { ITransactionTable } from "./ITransaction.ts";

export interface IPaymentAttemptTable extends IBaseModel {
	status: "pending" | "success" | "failed";
	failureReason: string | null;
	customerIp: string | null;
	customerData: Record<string, string> | null;
	attemptedAt: Date;

	transaction: ISU.SingleReference<ITransactionTable, "transactionId", "id">;
	paymentMethod: ISU.SingleReference<IPaymentMethodTable, "paymentMethodId", "id">;
}

export interface IPaymentAttempt extends ISU.Selectable<IPaymentAttemptTable> {}
export interface IInsertPaymentAttempt extends ISU.Insertable<IPaymentAttemptTable> {}
export interface IUpdatePaymentAttempt extends ISU.Updateable<IPaymentAttemptTable> {}

export const generateFakePaymentAttempt = createFakeGenerator<IPaymentAttempt>(
	"IPaymentAttempt",
	__filename
);

export const generateFakeInsertPaymentAttempt = createFakeGenerator<IInsertPaymentAttempt>(
	"IInsertPaymentAttempt",
	__filename
);
