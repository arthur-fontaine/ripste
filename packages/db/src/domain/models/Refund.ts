import * as z from "./utils/zod-db.ts";
import { type ITransaction, Transaction } from "./Transaction.ts";
import { type IUser, User } from "./User.ts";
import { zocker } from "zocker";

const refundTable = z.table({
	id: z.string(),
	amount: z.number(),
	reason: z.nullable(z.string()),
	status: z.enum(["pending", "processing", "completed", "failed"]),
	processedAt: z.nullable(z.date()),
	...z.timestamps(),
	transaction: z.relation.one(
		"transactionId",
		(): z.ZodMiniType<Pick<ITransaction, "id">> => Transaction,
		"id",
	),
	initiatedByUser: z.relation.one(
		"initiatedByUserId",
		(): z.ZodMiniNullable<z.ZodMiniType<Pick<IUser, "id">>> => z.nullable(User),
		"id",
	),
});

export const Refund = refundTable.select;
export interface IRefund extends z.infer<typeof Refund> {
	transaction: ITransaction;
	initiatedByUser: IUser | null;
}
export const generateFakeRefund = zocker(Refund).generate;

export const RefundInsert = refundTable.insert;
export interface IRefundInsert extends z.infer<typeof RefundInsert> {}
export const generateFakeRefundInsert = zocker(RefundInsert).generate;

export const RefundUpdate = refundTable.update;
export interface IRefundUpdate extends z.infer<typeof RefundUpdate> {}
export const generateFakeRefundUpdate = zocker(RefundUpdate).generate;
