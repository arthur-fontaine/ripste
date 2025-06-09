import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import type {
	ICheckoutPage,
	CheckoutDisplayData,
} from "../../../domain/models/ICheckoutPage.ts";
import { BaseModel } from "./BaseModel.ts";
import { CheckoutThemeModel } from "./CheckoutThemeModel.ts";
import { TransactionModel } from "./TransactionModel.ts";

@Entity()
export class CheckoutPageModel extends BaseModel implements ICheckoutPage {
	@Property({ type: t.string, unique: true })
	uri: string;

	@Property({ type: t.string })
	redirectSuccessUrl: string;

	@Property({ type: t.string, nullable: true })
	redirectCancelUrl: string | null;

	@Property({ type: t.json, nullable: true })
	displayData: CheckoutDisplayData | null;

	@Property({ type: t.datetime, nullable: true })
	expiresAt: Date | null;

	@Property({ type: t.datetime, nullable: true })
	accessedAt: Date | null;

	@Property({ type: t.datetime, nullable: true })
	completedAt: Date | null;

	@ManyToOne(() => TransactionModel, { nullable: true })
	transaction: TransactionModel | null;

	@ManyToOne(() => CheckoutThemeModel, { nullable: true })
	theme: CheckoutThemeModel | null;

	constructor({
		uri,
		redirectSuccessUrl,
		redirectCancelUrl,
		displayData,
		expiresAt,
		accessedAt,
		completedAt,
		transaction,
		theme,
	}: Pick<CheckoutPageModel, "uri" | "redirectSuccessUrl"> &
		Partial<
			Pick<
				CheckoutPageModel,
				| "redirectCancelUrl"
				| "displayData"
				| "expiresAt"
				| "accessedAt"
				| "completedAt"
				| "transaction"
				| "theme"
			>
		>) {
		super();
		this.uri = uri;
		this.redirectSuccessUrl = redirectSuccessUrl;
		this.redirectCancelUrl = redirectCancelUrl ?? null;
		this.displayData = displayData ?? null;
		this.expiresAt = expiresAt ?? null;
		this.accessedAt = accessedAt ?? null;
		this.completedAt = completedAt ?? null;
		this.transaction = transaction ?? null;
		this.theme = theme ?? null;
	}
}
