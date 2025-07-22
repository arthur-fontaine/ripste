import { Entity, ManyToOne, Property, t } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	ICheckoutDisplayData,
	ICheckoutPage,
	IInsertCheckoutPage,
} from "../../../domain/models/ICheckoutPage.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";
import { MikroOrmCheckoutThemeModel } from "./MikroOrmCheckoutThemeModel.ts";

@Entity()
export class MikroOrmCheckoutPageModel
	extends BaseModel
	implements ICheckoutPage
{
	constructor(params: IInsertCheckoutPage) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	uri!: string;

	@Property({ type: t.string, nullable: true })
	redirectSuccessUrl!: string | null;

	@Property({ type: t.string, nullable: true })
	redirectCancelUrl!: string | null;

	@Property({ type: t.json })
	displayData!: ICheckoutDisplayData;

	@Property({ type: t.datetime, nullable: true })
	expiresAt!: Date | null;

	@Property({ type: t.datetime, nullable: true })
	accessedAt!: Date | null;

	@Property({ type: t.datetime, nullable: true })
	completedAt!: Date | null;

	@ManyToOne(() => MikroOrmTransactionModel)
	transaction!: MikroOrmTransactionModel;

	get transactionId(): string {
		return this.transaction.id;
	}

	set transactionId(transactionId: string) {
		this.transaction = this._em.getReference(MikroOrmTransactionModel, transactionId);
	}

	@ManyToOne(() => MikroOrmCheckoutThemeModel)
	theme!: MikroOrmCheckoutThemeModel;

	get themeId(): string {
		return this.theme.id;
	}

	set themeId(themeId: string) {
		this.theme = this._em.getReference(MikroOrmCheckoutThemeModel, themeId);
	}
}
