import {
	Entity,
	Property,
	t,
	ManyToOne,
	OneToMany,
	Collection,
} from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IPaymentMethod,
	IInsertPaymentMethod,
} from "../../../domain/models/IPaymentMethod.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";
import { MikroOrmPaymentAttemptModel } from "./MikroOrmPaymentAttemptModel.ts";

@Entity()
export class MikroOrmPaymentMethodModel
	extends BaseModel
	implements IPaymentMethod
{
	constructor(params: IInsertPaymentMethod) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	methodType!: "checkout_page";

	@Property({ type: t.json, nullable: true })
	methodData!: Record<string, string> | null;

	@ManyToOne(() => MikroOrmTransactionModel)
	transaction!: MikroOrmTransactionModel;

	get transactionId(): string {
		return this.transaction.id;
	}

	@OneToMany(
		() => MikroOrmPaymentAttemptModel,
		(attempt) => attempt.paymentMethod,
	)
	_paymentAttempts = new Collection<MikroOrmPaymentAttemptModel>(this);
	get paymentAttempts(): MikroOrmPaymentAttemptModel[] {
		return this._paymentAttempts.getItems();
	}
}
