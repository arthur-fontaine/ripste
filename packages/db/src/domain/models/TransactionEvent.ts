import * as z from "./utils/zod-db.ts";
import { Transaction } from "./Transaction.ts";
import { zocker } from "zocker";

const transactionEventTable = z.table({
	id: z.string(),
	eventType: z.string(),
	eventData: z.nullable(z.any()), // You may want to refine this
	...z.timestamps(),
	transaction: z.relation.one("transactionId", () => Transaction, "id"),
});

export const TransactionEvent = transactionEventTable.select;
export interface ITransactionEvent extends z.infer<typeof TransactionEvent> {}
export const generateFakeTransactionEvent = zocker(TransactionEvent).generate;

export const TransactionEventInsert = transactionEventTable.insert;
export interface ITransactionEventInsert
	extends z.infer<typeof TransactionEventInsert> {}
export const generateFakeTransactionEventInsert = zocker(
	TransactionEventInsert,
).generate;

export const TransactionEventUpdate = transactionEventTable.update;
export interface ITransactionEventUpdate
	extends z.infer<typeof TransactionEventUpdate> {}
export const generateFakeTransactionEventUpdate = zocker(
	TransactionEventUpdate,
).generate;
