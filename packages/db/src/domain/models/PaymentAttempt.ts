import * as z from "./utils/zod-db.ts";
import { Transaction } from "./Transaction.ts";
import { PaymentMethod } from "./PaymentMethod.ts";
import { zocker } from "zocker";

const paymentAttemptTable = z.table({
	id: z.string(),
	status: z.enum(["pending", "success", "failed"]),
	failureReason: z.nullable(z.string()),
	customerIp: z.nullable(z.string()),
	customerData: z.nullable(z.record(z.string(), z.string())),
	attemptedAt: z.date(),
	...z.timestamps(),
	transaction: z.relation.one(
		"transactionId",
		(): z.ZodMiniType<Pick<Transaction, "id">> => Transaction,
		"id",
	),
	paymentMethod: z.relation.one(
		"paymentMethodId",
		(): z.ZodMiniType<Pick<PaymentMethod, "id">> => PaymentMethod,
		"id",
	),
});

export const PaymentAttempt = paymentAttemptTable.select;
export interface PaymentAttempt extends z.infer<typeof PaymentAttempt> {
	transaction: Transaction;
	paymentMethod: PaymentMethod;
}
export const generateFakePaymentAttempt = zocker(PaymentAttempt).generate;

export const PaymentAttemptInsert = paymentAttemptTable.insert;
export interface PaymentAttemptInsert
	extends z.infer<typeof PaymentAttemptInsert> {}
export const generateFakePaymentAttemptInsert =
	zocker(PaymentAttemptInsert).generate;

export const PaymentAttemptUpdate = paymentAttemptTable.update;
export interface PaymentAttemptUpdate
	extends z.infer<typeof PaymentAttemptUpdate> {}
export const generateFakePaymentAttemptUpdate =
	zocker(PaymentAttemptUpdate).generate;
