import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IPaymentAttempt,
	IPaymentAttemptInsert,
} from "../../../domain/models/PaymentAttempt.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";
import { MikroOrmPaymentMethodModel } from "./MikroOrmPaymentMethodModel.ts";

@Entity()
export class MikroOrmPaymentAttemptModel
	extends BaseModel
	implements IPaymentAttempt
{
	constructor(params: IPaymentAttemptInsert) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	status!: "pending" | "success" | "failed";

	@Property({ type: t.string, nullable: true })
	failureReason!: string | null;

	@Property({ type: t.string, nullable: true })
	customerIp!: string | null;

	@Property({ type: t.json, nullable: true })
	customerData!: Record<string, string> | null;

	@Property({ type: t.datetime })
	attemptedAt!: Date;

	@ManyToOne(() => MikroOrmTransactionModel)
	transaction!: MikroOrmTransactionModel;

	@ManyToOne(() => MikroOrmPaymentMethodModel)
	paymentMethod!: MikroOrmPaymentMethodModel;
}
