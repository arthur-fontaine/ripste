import type {
	IInsertTransactionEvent,
	ITransactionEvent,
} from "../models/ITransactionEvent.ts";

export interface ITransactionEventRepository {
	findById(id: string): Promise<ITransactionEvent | null>;
	findByTransactionId(transactionId: string): Promise<ITransactionEvent[]>;
	findByEventType(eventType: string): Promise<ITransactionEvent[]>;
	findByTransactionAndEventType(
		transactionId: string,
		eventType: string,
	): Promise<ITransactionEvent[]>;
	findEventHistory(
		transactionId: string,
		options?: { limit?: number; fromDate?: Date; toDate?: Date },
	): Promise<ITransactionEvent[]>;
	findRecentEvents(options?: {
		limit?: number;
		eventTypes?: string[];
	}): Promise<ITransactionEvent[]>;
	create(eventData: IInsertTransactionEvent): Promise<ITransactionEvent>;
	update(
		id: string,
		eventData: IInsertTransactionEvent,
	): Promise<ITransactionEvent>;
	delete(id: string): Promise<void>;
	deleteByTransactionId(transactionId: string): Promise<void>;
}
