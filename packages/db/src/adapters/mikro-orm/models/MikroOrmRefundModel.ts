import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type { IRefund, IInsertRefund } from "../../../domain/models/IRefund.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";

@Entity()
export class MikroOrmRefundModel extends BaseModel implements IRefund {
	constructor(params: IInsertRefund) {
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

	get transactionId(): string {
		return this.transaction.id;
	}

	@ManyToOne(() => MikroOrmUserModel, { nullable: true })
	initiatedByUser!: MikroOrmUserModel | null;

	get initiatedByUserId(): string | null {
		return this.initiatedByUser ? this.initiatedByUser.id : null;
	}
}
