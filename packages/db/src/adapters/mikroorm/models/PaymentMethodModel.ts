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
	API_DIRECT: "api_direct",
	LINK: "link",
	QR_CODE: "qr_code",
} as const;

@Entity()
export class PaymentMethodModel extends BaseModel implements IPaymentMethod {
	@Enum(() => MethodType)
	methodType: "checkout_page" | "api_direct" | "link" | "qr_code";

	@Property({ type: t.json, nullable: true })
	methodData: Record<string, string> | null;

	@ManyToOne(() => TransactionModel, { nullable: true })
	transaction: TransactionModel | null;

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
		methodData,
		transaction,
	}: Pick<PaymentMethodModel, "methodType"> &
		Partial<Pick<PaymentMethodModel, "methodData" | "transaction">>) {
		super();
		this.methodType = methodType;
		this.methodData = methodData ?? null;
		this.transaction = transaction ?? null;
	}
}
