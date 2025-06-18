import type { Insertable } from "../../types/insertable.ts";
import type { IApiCredential } from "./IApiCredential.ts";
import type { ICheckoutPage } from "./ICheckoutPage.ts";
import type { IPaymentAttempt } from "./IPaymentAttempt.ts";
import type { IPaymentMethod } from "./IPaymentMethod.ts";
import type { IRefund } from "./IRefund.ts";
import type { IStore } from "./IStore.ts";
import type { ITransactionEvent } from "./ITransactionEvent.ts";

export interface ITransaction {
	id: string;
	reference: string;
	amount: number;
	currency: string;
	status: "created" | "processing" | "completed" | "failed" | "cancelled";
	metadata: Record<string, string> | null;
	apiCredentialId: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;

	store: IStore;
	apiCredential: IApiCredential | null;
	transactionEvents: ITransactionEvent[];
	paymentMethods: IPaymentMethod[];
	checkoutPages: ICheckoutPage[];
	paymentAttempts: IPaymentAttempt[];
	refunds: IRefund[];
}

export type IInsertTransaction = Insertable<
	ITransaction,
	| "metadata"
	| "store"
	| "apiCredential"
	| "transactionEvents"
	| "paymentMethods"
	| "checkoutPages"
	| "paymentAttempts"
	| "refunds"
> & {
	storeId: IStore["id"];
	apiCredentialId: IApiCredential["id"] | null;
	paymentMethodId: IPaymentMethod["id"] | null;
	metadata: Record<string, string> | null;
};
