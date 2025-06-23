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

	@Property({ type: t.string, nullable: true })
	redirectSuccessUrl: string | null;

	@Property({ type: t.string, nullable: true })
	redirectCancelUrl: string | null;

	@Property({ type: t.json })
	displayData: CheckoutDisplayData;

	@Property({ type: t.datetime, nullable: true })
	expiresAt: Date | null;

	@Property({ type: t.datetime, nullable: true })
	accessedAt: Date | null;

	@Property({ type: t.datetime, nullable: true })
	completedAt: Date | null;

	@ManyToOne(() => TransactionModel)
	transaction: TransactionModel;

	get transactionId(): string {
		return this.transaction.id;
	}

	@ManyToOne(() => CheckoutThemeModel)
	theme: CheckoutThemeModel;

	get themeId(): string {
		return this.theme.id;
	}

	constructor({
		uri,
		displayData,
		transaction,
		theme,
		redirectSuccessUrl,
		redirectCancelUrl,
		expiresAt,
		accessedAt,
		completedAt,
	}: Pick<CheckoutPageModel, "uri" | "displayData" | "transaction" | "theme"> &
		Partial<
			Pick<
				CheckoutPageModel,
				| "redirectSuccessUrl"
				| "redirectCancelUrl"
				| "expiresAt"
				| "accessedAt"
				| "completedAt"
			>
		>) {
		super();
		this.uri = uri;
		this.redirectSuccessUrl = redirectSuccessUrl ?? null;
		this.redirectCancelUrl = redirectCancelUrl ?? null;
		this.displayData = displayData;
		this.expiresAt = expiresAt ?? null;
		this.accessedAt = accessedAt ?? null;
		this.completedAt = completedAt ?? null;
		this.transaction = transaction;
		this.theme = theme;
	}
}
