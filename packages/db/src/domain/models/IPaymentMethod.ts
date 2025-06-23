import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IPaymentAttemptTable } from "./IPaymentAttempt.ts";
import type { ITransactionTable } from "./ITransaction.ts";

export interface IPaymentMethodTable extends IBaseModel {
	methodType: "checkout_page";
	methodData: Record<string, string> | null;
	transaction: ISU.SingleReference<ITransactionTable, "transactionId", "id">;
	paymentAttempts: ISU.ManyReference<IPaymentAttemptTable>;
}

export interface IPaymentMethod extends ISU.Selectable<IPaymentMethodTable> {}
export interface IInsertPaymentMethod
	extends ISU.Insertable<IPaymentMethodTable> {}
export interface IUpdatePaymentMethod
	extends ISU.Updateable<IPaymentMethodTable> {}

export const generateFakePaymentMethod = createFakeGenerator<IPaymentMethod>(
	"IPaymentMethod",
	__filename,
);

export const generateFakeInsertPaymentMethod =
	createFakeGenerator<IInsertPaymentMethod>("IInsertPaymentMethod", __filename);
