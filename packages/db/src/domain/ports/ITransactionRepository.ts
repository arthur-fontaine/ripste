import type {
	IInsertTransaction,
	ITransaction,
} from "../models/ITransaction.ts";
import type {
	IInsertTransactionEvent,
	ITransactionEvent,
} from "../models/ITransactionEvent.ts";

export interface ITransactionRepository {
	findById(id: string): Promise<ITransaction | null>;
	findMany(params: {
		storeId?: string;
		reference?: string;
		limit?: number;
	}): Promise<ITransaction[]>;
	create(transactionData: IInsertTransaction): Promise<ITransaction>;
	update(
		id: string,
		transactionData: IInsertTransaction,
	): Promise<ITransaction>;
	delete(id: string): Promise<void>;
	recordEvent(eventData: IInsertTransactionEvent): Promise<ITransactionEvent>;
	updateEvent(
		id: string,
		eventData: IInsertTransactionEvent,
	): Promise<ITransactionEvent>;
	getEvents(params: {
		transactionId?: string;
		eventType?: string;
		fromDate?: Date;
		toDate?: Date;
		limit?: number;
		eventTypes?: string[];
	}): Promise<ITransactionEvent[]>;
	findEventById(id: string): Promise<ITransactionEvent | null>;
	deleteEvent(id: string): Promise<void>;
	deleteEventsByTransactionId(transactionId: string): Promise<void>;
}
