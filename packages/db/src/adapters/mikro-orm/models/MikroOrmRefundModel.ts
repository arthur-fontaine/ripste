import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type { IRefund, IRefundInsert } from "../../../domain/models/Refund.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";

@Entity()
export class MikroOrmRefundModel extends BaseModel implements IRefund {
	constructor(params: IRefundInsert) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.float })
	amount!: number;

	@Property({ type: t.string, nullable: true })
	reason!: string | null;

	@Property({ type: t.string })
	status!: "pending" | "processing" | "completed" | "failed";

	@Property({ type: t.datetime, nullable: true })
	processedAt!: Date | null;

	@ManyToOne(() => MikroOrmTransactionModel)
	transaction!: MikroOrmTransactionModel;

	@ManyToOne(() => MikroOrmUserModel, { nullable: true })
	initiatedByUser!: MikroOrmUserModel | null;
}
