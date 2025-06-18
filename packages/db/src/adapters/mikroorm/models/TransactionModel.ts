import {
	Entity,
	Property,
	t,
	Enum,
	ManyToOne,
	OneToMany,
	Collection,
} from "@mikro-orm/core";
import type { ITransaction } from "../../../domain/models/ITransaction.ts";
import { BaseModel } from "./BaseModel.ts";
import { StoreModel } from "./StoreModel.ts";
import { ApiCredentialModel } from "./ApiCredentialModel.ts";
import { CheckoutPageModel } from "./CheckoutPageModel.ts";
import { TransactionEventModel } from "./TransactionEventModel.ts";
import { RefundModel } from "./RefundModel.ts";
import { PaymentMethodModel } from "./PaymentMethodModel.ts";
import { PaymentAttemptModel } from "./PaymentAttemptModel.ts";

const TransactionStatus = {
	CREATED: "created",
	PROCESSING: "processing",
	COMPLETED: "completed",
	FAILED: "failed",
	CANCELLED: "cancelled",
} as const;

@Entity()
export class TransactionModel extends BaseModel implements ITransaction {
	@Property({ type: t.string, unique: true })
	reference: string;

	@Property({ type: t.integer })
	amount: number;

	@Property({ type: t.string })
	currency: string;

	@Enum(() => TransactionStatus)
	status: "created" | "processing" | "completed" | "failed" | "cancelled";

	@Property({ type: t.json, nullable: true })
	metadata: Record<string, string> | null;

	@Property({ type: t.string, nullable: true })
	apiCredentialId: string | null;

	@ManyToOne(() => StoreModel)
	store: StoreModel;

	@ManyToOne(() => ApiCredentialModel, { nullable: true })
	apiCredential: ApiCredentialModel | null;

	@OneToMany(
		() => CheckoutPageModel,
		(page) => page.transaction,
	)
	private _checkoutPages = new Collection<CheckoutPageModel>(this);

	get checkoutPages(): CheckoutPageModel[] {
		return this._checkoutPages.getItems();
	}

	@OneToMany(
		() => TransactionEventModel,
		(event) => event.transaction,
	)
	private _transactionEvents = new Collection<TransactionEventModel>(this);

	get transactionEvents(): TransactionEventModel[] {
		return this._transactionEvents.getItems();
	}

	@OneToMany(
		() => PaymentMethodModel,
		(paymentMethod) => paymentMethod.transaction,
	)
	private _paymentMethods = new Collection<PaymentMethodModel>(this);

	get paymentMethods(): PaymentMethodModel[] {
		return this._paymentMethods.getItems();
	}

	@OneToMany(
		() => PaymentAttemptModel,
		(attempt) => attempt.transaction,
	)
	private _paymentAttempts = new Collection<PaymentAttemptModel>(this);

	get paymentAttempts(): PaymentAttemptModel[] {
		return this._paymentAttempts.getItems();
	}

	@OneToMany(
		() => RefundModel,
		(refund) => refund.transaction,
	)
	private _refunds = new Collection<RefundModel>(this);

	get refunds(): RefundModel[] {
		return this._refunds.getItems();
	}

	constructor({
		reference,
		amount,
		currency,
		store,
		status = TransactionStatus.CREATED,
		metadata,
		apiCredentialId,
		apiCredential,
	}: Pick<TransactionModel, "reference" | "amount" | "currency" | "store"> &
		Partial<
			Pick<
				TransactionModel,
				"status" | "metadata" | "apiCredentialId" | "apiCredential"
			>
		>) {
		super();
		this.reference = reference;
		this.amount = amount;
		this.currency = currency;
		this.store = store;
		this.status = status;
		this.metadata = metadata ?? null;
		this.apiCredentialId = apiCredentialId ?? null;
		this.apiCredential = apiCredential ?? null;
	}
}
