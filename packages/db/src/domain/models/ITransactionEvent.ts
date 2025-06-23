import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { ITransactionTable } from "./ITransaction.ts";
import type { IsoString } from "../../types/iso-string.d.ts";

export interface ITransactionEventTable extends IBaseModel {
	eventType: string;
	eventData: TransactionEventData | null;
	occurredAt: Date;
	transaction: ISU.SingleReference<ITransactionTable, "transactionId", "id">;
}

export interface ITransactionEvent extends ISU.Selectable<ITransactionEventTable> {}
export interface IInsertTransactionEvent extends ISU.Insertable<ITransactionEventTable> {}
export interface IUpdateTransactionEvent extends ISU.Updateable<ITransactionEventTable> {}

export type TransactionEventData =
	| TransactionCreatedEvent
	| TransactionProcessingEvent
	| TransactionCompletedEvent
	| TransactionFailedEvent
	| TransactionCancelledEvent
	| PaymentAttemptEvent
	| RefundEvent;

export interface TransactionCreatedEvent {
	type: "transaction_created";
	amount: number;
	currency: string;
	reference: string;
	storeId: string;
}

export interface TransactionProcessingEvent {
	type: "transaction_processing";
	paymentMethodId: string;
	processingStartedAt: IsoString;
}

export interface TransactionCompletedEvent {
	type: "transaction_completed";
	paymentMethodId: string;
	completedAt: IsoString;
	paymentProcessorResponse: {
		transactionId: string;
		status: string;
		authCode: string | null;
	} | null;
}

export interface TransactionFailedEvent {
	type: "transaction_failed";
	reason: string | null;
	paymentMethodId: string | null;
	errorCode: string | null;
}

export interface TransactionCancelledEvent {
	type: "transaction_cancelled";
	reason: string | null;
	cancelledBy: "customer" | "merchant" | "system";
	cancelledAt: IsoString;
}

export interface PaymentAttemptEvent {
	type: "payment_attempt";
	paymentMethodId: string;
	status: "started" | "completed" | "failed";
	attemptNumber: number;
	customerIp: string | null;
}

export interface RefundEvent {
	type: "refund_initiated" | "refund_completed" | "refund_failed";
	refundId: string;
	amount: number;
	reason: string | null;
}

export const generateFakeTransactionEvent = createFakeGenerator<ITransactionEvent>(
	"ITransactionEvent",
	__filename
);

export const generateFakeInsertTransactionEvent = createFakeGenerator<IInsertTransactionEvent>(
	"IInsertTransactionEvent",
	__filename
);
