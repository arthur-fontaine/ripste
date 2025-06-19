import { Entity, ManyToOne, Property, t } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	ICheckoutDisplayData,
	ICheckoutPage,
	ICheckoutPageInsert,
} from "../../../domain/models/CheckoutPage.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";
import { MikroOrmCheckoutThemeModel } from "./MikroOrmCheckoutThemeModel.js";

@Entity()
export class MikroOrmCheckoutPageModel
	extends BaseModel
	implements ICheckoutPage
{
	constructor(params: ICheckoutPageInsert) {
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

	@ManyToOne(() => MikroOrmCheckoutThemeModel)
	theme!: MikroOrmCheckoutThemeModel;
}
