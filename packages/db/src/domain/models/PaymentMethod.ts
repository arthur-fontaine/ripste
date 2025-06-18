import * as z from "./utils/zod-db.ts";
import { type ITransaction, Transaction } from "./Transaction.ts";
import { PaymentAttempt } from "./PaymentAttempt.ts";
import { zocker } from "zocker";

const paymentMethodTable = z.table({
	id: z.string(),
	methodType: z.enum(["checkout_page"]),
	methodData: z.nullable(z.record(z.string(), z.string())),
	...z.timestamps(),
	transaction: z.relation.one(
		"transactionId",
		(): z.ZodMiniType<Pick<ITransaction, "id">> => Transaction,
		"id",
	),
	paymentAttempts: z.relation.many(() => PaymentAttempt),
});

export const PaymentMethod = paymentMethodTable.select;
export interface IPaymentMethod extends z.infer<typeof PaymentMethod> {
	transaction: ITransaction;
}
export const generateFakePaymentMethod = zocker(PaymentMethod).generate;

export const PaymentMethodInsert = paymentMethodTable.insert;
export interface IPaymentMethodInsert
	extends z.infer<typeof PaymentMethodInsert> {}
export const generateFakePaymentMethodInsert =
	zocker(PaymentMethodInsert).generate;

export const PaymentMethodUpdate = paymentMethodTable.update;
export interface IPaymentMethodUpdate
	extends z.infer<typeof PaymentMethodUpdate> {}
export const generateFakePaymentMethodUpdate =
	zocker(PaymentMethodUpdate).generate;
