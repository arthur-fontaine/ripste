import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import type {
	ITransactionEvent,
	TransactionEventData,
} from "../../../domain/models/ITransactionEvent.ts";
import { BaseModel } from "./BaseModel.ts";
import { TransactionModel } from "./TransactionModel.ts";

@Entity()
export class TransactionEventModel
	extends BaseModel
	implements ITransactionEvent
{
	@Property({ type: t.string })
	eventType: string;

	@Property({ type: t.json, nullable: true })
	eventData: TransactionEventData | null;

	@Property({ type: t.datetime })
	occurredAt: Date;

	@ManyToOne(() => TransactionModel)
	transaction: TransactionModel;

	get transactionId(): string {
		return this.transaction.id;
	}

	constructor({
		eventType,
		transaction,
		eventData,
		occurredAt = new Date(),
	}: Pick<TransactionEventModel, "eventType" | "transaction"> &
		Partial<Pick<TransactionEventModel, "eventData" | "occurredAt">>) {
		super();
		this.eventType = eventType;
		this.eventData = eventData ?? null;
		this.occurredAt = occurredAt;
		this.transaction = transaction;
	}
}
