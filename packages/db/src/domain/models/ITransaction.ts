import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IStoreTable } from "./IStore.ts";
import type { ITransactionEventTable } from "./ITransactionEvent.ts";
import type { ICheckoutPageTable } from "./ICheckoutPage.ts";
import type { IPaymentAttemptTable } from "./IPaymentAttempt.ts";
import type { IRefundTable } from "./IRefund.ts";
import type { ISession } from "./ISession.ts";

export interface ITransactionTable extends IBaseModel {
	reference: string;
	amount: number;
	currency: string;
	status: "created" | "processing" | "completed" | "failed" | "cancelled";
	methodType: "checkout_page" | "api_direct" | "link" | "qr_code";
	metadata: Record<string, string> | null;

	session: ISU.SingleReference<ISession, "sessionId", "id">;
	store: ISU.SingleReference<IStoreTable, "storeId", "id">;
	transactionEvents: ISU.ManyReference<ITransactionEventTable>;
	checkoutPages: ISU.ManyReference<ICheckoutPageTable>;
	paymentAttempts: ISU.ManyReference<IPaymentAttemptTable>;
	refunds: ISU.ManyReference<IRefundTable>;
}

export interface ITransaction extends ISU.Selectable<ITransactionTable> {}
export interface IInsertTransaction extends ISU.Insertable<ITransactionTable> {}
export interface IUpdateTransaction extends ISU.Updateable<ITransactionTable> {}

export const generateFakeTransaction = createFakeGenerator<ITransaction>(
	"ITransaction",
	__filename,
);

export const generateFakeInsertTransaction =
	createFakeGenerator<IInsertTransaction>("IInsertTransaction", __filename);
