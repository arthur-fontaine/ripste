import * as z from "./utils/zod-db.ts";
import { type ITransaction, Transaction } from "./Transaction.ts";
import { type IPaymentMethod, PaymentMethod } from "./PaymentMethod.ts";
import { zocker } from "zocker";

const paymentAttemptTable = z.table({
	id: z.generated(z.string()),
	status: z.enum(["pending", "success", "failed"]),
	failureReason: z.nullable(z.string()),
	customerIp: z.nullable(z.string()),
	customerData: z.nullable(z.record(z.string(), z.string())),
	attemptedAt: z.date(),
	...z.timestamps(),
	transaction: z.relation.one(
		"transactionId",
		(): z.ZodMiniType<Pick<ITransaction, "id">> => Transaction,
		"id",
	),
	paymentMethod: z.relation.one(
		"paymentMethodId",
		(): z.ZodMiniType<Pick<IPaymentMethod, "id">> => PaymentMethod,
		"id",
	),
});

export const PaymentAttempt = paymentAttemptTable.select;
export interface IPaymentAttempt extends z.infer<typeof PaymentAttempt> {
	transaction: ITransaction;
	paymentMethod: IPaymentMethod;
}
export const generateFakePaymentAttempt = () =>
	zocker(PaymentAttempt).generate();

export const PaymentAttemptInsert = paymentAttemptTable.insert;
export interface IPaymentAttemptInsert
	extends z.infer<typeof PaymentAttemptInsert> {}
export const generateFakePaymentAttemptInsert = () =>
	zocker(PaymentAttemptInsert).generate();

export const PaymentAttemptUpdate = paymentAttemptTable.update;
export interface IPaymentAttemptUpdate
	extends z.infer<typeof PaymentAttemptUpdate> {}
export const generateFakePaymentAttemptUpdate = () =>
	zocker(PaymentAttemptUpdate).generate();
