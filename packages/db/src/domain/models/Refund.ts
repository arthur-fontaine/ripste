import * as z from "./utils/zod-db.ts";
import { Transaction } from "./Transaction.ts";
import { User } from "./User.ts";
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
		(): z.ZodMiniType<Pick<Transaction, "id">> => Transaction,
		"id",
	),
	initiatedByUser: z.relation.one(
		"initiatedByUserId",
		(): z.ZodMiniNullable<z.ZodMiniType<Pick<User, "id">>> => z.nullable(User),
		"id",
	),
});

export const Refund = refundTable.select;
export interface Refund extends z.infer<typeof Refund> {
	transaction: Transaction;
	initiatedByUser: User | null;
}
export const generateFakeRefund = zocker(Refund).generate;

export const RefundInsert = refundTable.insert;
export interface RefundInsert extends z.infer<typeof RefundInsert> {}
export const generateFakeRefundInsert = zocker(RefundInsert).generate;

export const RefundUpdate = refundTable.update;
export interface RefundUpdate extends z.infer<typeof RefundUpdate> {}
export const generateFakeRefundUpdate = zocker(RefundUpdate).generate;
