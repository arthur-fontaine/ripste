import * as z from "./utils/zod-db.ts";
import { Transaction } from "./Transaction.ts";
import { PaymentAttempt } from "./PaymentAttempt.ts";
import { zocker } from "zocker";

const paymentMethodTable = z.table({
	id: z.string(),
	methodType: z.enum(["checkout_page"]),
	methodData: z.nullable(z.record(z.string(), z.string())),
	...z.timestamps(),
	transaction: z.relation.one(
		"transactionId",
		(): z.ZodMiniType<Pick<Transaction, "id">> => Transaction,
		"id",
	),
	paymentAttempts: z.relation.many(() => PaymentAttempt),
});

export const PaymentMethod = paymentMethodTable.select;
export interface PaymentMethod extends z.infer<typeof PaymentMethod> {
	transaction: Transaction;
}
export const generateFakePaymentMethod = zocker(PaymentMethod).generate;

export const PaymentMethodInsert = paymentMethodTable.insert;
export interface PaymentMethodInsert
	extends z.infer<typeof PaymentMethodInsert> {}
export const generateFakePaymentMethodInsert =
	zocker(PaymentMethodInsert).generate;

export const PaymentMethodUpdate = paymentMethodTable.update;
export interface PaymentMethodUpdate
	extends z.infer<typeof PaymentMethodUpdate> {}
export const generateFakePaymentMethodUpdate =
	zocker(PaymentMethodUpdate).generate;
