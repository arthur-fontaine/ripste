import {
	Entity,
	Property,
	t,
	Enum,
	ManyToOne,
	OneToMany,
	Collection,
} from "@mikro-orm/core";
import type { IPaymentMethod } from "../../../domain/models/IPaymentMethod.ts";
import { BaseModel } from "./BaseModel.ts";
import { TransactionModel } from "./TransactionModel.ts";
import { PaymentAttemptModel } from "./PaymentAttemptModel.ts";

const MethodType = {
	CHECKOUT_PAGE: "checkout_page",
} as const;

@Entity()
export class PaymentMethodModel extends BaseModel implements IPaymentMethod {
	@Enum(() => MethodType)
	methodType: "checkout_page";

	@Property({ type: t.json, nullable: true })
	methodData: Record<string, string> | null;

	@ManyToOne(() => TransactionModel)
	transaction: TransactionModel;

	get transactionId(): string {
		return this.transaction.id;
	}

	@OneToMany(
		() => PaymentAttemptModel,
		(attempt) => attempt.paymentMethod,
	)
	private _paymentAttempts = new Collection<PaymentAttemptModel>(this);

	get paymentAttempts(): PaymentAttemptModel[] {
		return this._paymentAttempts.getItems();
	}

	constructor({
		methodType,
		transaction,
		methodData,
	}: Pick<PaymentMethodModel, "methodType" | "transaction"> &
		Partial<Pick<PaymentMethodModel, "methodData">>) {
		super();
		this.methodType = methodType;
		this.methodData = methodData ?? null;
		this.transaction = transaction;
	}
}
