import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	ITransactionEvent,
	IInsertTransactionEvent,
	ITransactionEventData,
} from "../../../domain/models/ITransactionEvent.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";

@Entity()
export class MikroOrmTransactionEventModel
	extends BaseModel
	implements ITransactionEvent
{
	constructor(params: IInsertTransactionEvent) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	eventType!: string;

	@Property({ type: t.json, nullable: true })
	eventData!: ITransactionEventData | null;

	@ManyToOne(() => MikroOrmTransactionModel)
	transaction!: MikroOrmTransactionModel;

	get transactionId(): string {
		return this.transaction.id;
	}
}
