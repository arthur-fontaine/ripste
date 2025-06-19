import * as z from "./utils/zod-db.ts";
import { ApiCredential } from "./ApiCredential.ts";
import { CheckoutPage, type ICheckoutPage } from "./CheckoutPage.ts";
import { PaymentAttempt } from "./PaymentAttempt.ts";
import { PaymentMethod } from "./PaymentMethod.ts";
import { Refund } from "./Refund.ts";
import { type IStore, Store } from "./Store.ts";
import {
	type ITransactionEvent,
	TransactionEvent,
} from "./TransactionEvent.ts";
import { zocker } from "zocker";

const transactionTable = z.table({
	id: z.generated(z.string()),
	reference: z.string(),
	amount: z.number(),
	currency: z.string(),
	status: z.enum(["created", "processing", "completed", "failed", "cancelled"]),
	metadata: z.nullable(z.record(z.string(), z.string())),
	...z.timestamps(),
	store: z.relation.one(
		"storeId",
		(): z.ZodMiniType<Pick<IStore, "id">> => Store,
		"id",
	),
	apiCredential: z.relation.one(
		"apiCredentialId",
		() => z.nullable(ApiCredential),
		"id",
	),
	transactionEvents: z.relation.many(
		(): z.ZodMiniType<Pick<ITransactionEvent, "id">> => TransactionEvent,
	),
	paymentMethods: z.relation.many(() => PaymentMethod),
	checkoutPages: z.relation.many(
		(): z.ZodMiniType<Pick<ICheckoutPage, "id">> => CheckoutPage,
	),
	paymentAttempts: z.relation.many(() => PaymentAttempt),
	refunds: z.relation.many(() => Refund),
});

export const Transaction = transactionTable.select;
export interface ITransaction extends z.infer<typeof Transaction> {
	store: IStore;
	transactionEvents: ITransactionEvent[];
	checkoutPages: ICheckoutPage[];
}
export const generateFakeTransaction = () => zocker(Transaction).generate();

export const TransactionInsert = transactionTable.insert;
export interface ITransactionInsert extends z.infer<typeof TransactionInsert> {}
export const generateFakeTransactionInsert = () =>
	zocker(TransactionInsert).generate();

export const TransactionUpdate = transactionTable.update;
export interface ITransactionUpdate extends z.infer<typeof TransactionUpdate> {}
export const generateFakeTransactionUpdate = () =>
	zocker(TransactionUpdate).generate();
