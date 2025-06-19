import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	ITransactionEvent,
	ITransactionEventInsert,
} from "../../../domain/models/TransactionEvent.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";

@Entity()
export class MikroOrmTransactionEventModel
	extends BaseModel
	implements ITransactionEvent
{
	constructor(params: ITransactionEventInsert) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	eventType!: string;

	@Property({ type: t.json, nullable: true })
	eventData!: unknown;

	@ManyToOne(() => MikroOrmTransactionModel)
	transaction!: MikroOrmTransactionModel;
}
