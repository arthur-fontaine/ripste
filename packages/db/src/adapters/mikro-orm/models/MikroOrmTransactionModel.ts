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
	ITransaction,
	IInsertTransaction,
} from "../../../domain/models/ITransaction.ts";
import { MikroOrmStoreModel } from "./MikroOrmStoreModel.ts";
import { MikroOrmApiCredentialModel } from "./MikroOrmApiCredentialModel.ts";
import { MikroOrmTransactionEventModel } from "./MikroOrmTransactionEventModel.ts";
import { MikroOrmCheckoutPageModel } from "./MikroOrmCheckoutPageModel.ts";
import { MikroOrmPaymentAttemptModel } from "./MikroOrmPaymentAttemptModel.ts";
import { MikroOrmRefundModel } from "./MikroOrmRefundModel.ts";

@Entity()
export class MikroOrmTransactionModel
	extends BaseModel
	implements ITransaction
{
	constructor(params: IInsertTransaction) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	reference!: string;

	@Property({ type: t.integer })
	amount!: number;

	@Property({ type: t.string })
	currency!: string;

	@Property({ type: t.string })
	status!: "created" | "processing" | "completed" | "failed" | "cancelled";

	@Property({ type: t.string })
	methodType!: "checkout_page" | "api_direct" | "link" | "qr_code";

	@Property({ type: t.json, nullable: true })
	metadata!: Record<string, string> | null;

	@ManyToOne(() => MikroOrmStoreModel)
	store!: MikroOrmStoreModel;

	get storeId(): string {
		return this.store.id;
	}

	@ManyToOne(() => MikroOrmApiCredentialModel, { nullable: true })
	apiCredential: MikroOrmApiCredentialModel | null = null;

	get apiCredentialId(): string | null {
		return this.apiCredential ? this.apiCredential.id : null;
	}

	@OneToMany(
		() => MikroOrmTransactionEventModel,
		(event) => event.transaction,
	)
	_transactionEvents = new Collection<MikroOrmTransactionEventModel>(this);
	get transactionEvents(): MikroOrmTransactionEventModel[] {
		return this._transactionEvents.getItems();
	}

	@OneToMany(
		() => MikroOrmCheckoutPageModel,
		(page) => page.transaction,
	)
	_checkoutPages = new Collection<MikroOrmCheckoutPageModel>(this);
	get checkoutPages(): MikroOrmCheckoutPageModel[] {
		return this._checkoutPages.getItems();
	}

	@OneToMany(
		() => MikroOrmPaymentAttemptModel,
		(attempt) => attempt.transaction,
	)
	_paymentAttempts = new Collection<MikroOrmPaymentAttemptModel>(this);
	get paymentAttempts(): MikroOrmPaymentAttemptModel[] {
		return this._paymentAttempts.getItems();
	}

	@OneToMany(
		() => MikroOrmRefundModel,
		(refund) => refund.transaction,
	)
	_refunds = new Collection<MikroOrmRefundModel>(this);
	get refunds(): MikroOrmRefundModel[] {
		return this._refunds.getItems();
	}
}
