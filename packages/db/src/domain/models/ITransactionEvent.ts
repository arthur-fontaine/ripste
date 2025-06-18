import type { Insertable } from "../../types/insertable.ts";
import type { ITransaction } from "./ITransaction.ts";
import type { IsoString } from "../../types/iso-string.ts";

export interface ITransactionEvent {
	id: string;
	eventType: string;
	eventData: TransactionEventData | null;
	occurredAt: Date;
	deletedAt: Date | null;

	transaction: ITransaction;
}

export type IInsertTransactionEvent = Insertable<
	ITransactionEvent,
	"transaction"
> & {
	transactionId: ITransaction["id"];
};

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
