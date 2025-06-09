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

	@ManyToOne(() => TransactionModel, { nullable: true })
	transaction: TransactionModel | null;

	constructor({
		eventType,
		eventData,
		occurredAt = new Date(),
		transaction,
	}: Pick<TransactionEventModel, "eventType"> &
		Partial<
			Pick<TransactionEventModel, "eventData" | "occurredAt" | "transaction">
		>) {
		super();
		this.eventType = eventType;
		this.eventData = eventData ?? null;
		this.occurredAt = occurredAt;
		this.transaction = transaction ?? null;
	}
}
