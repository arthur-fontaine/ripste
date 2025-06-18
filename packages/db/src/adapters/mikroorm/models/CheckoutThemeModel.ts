import {
	Entity,
	Property,
	t,
	ManyToOne,
	OneToMany,
	Collection,
} from "@mikro-orm/core";
import { BaseModel } from "./BaseModel.ts";
import type { ICheckoutTheme } from "../../../domain/models/ICheckoutTheme.ts";
import { StoreModel } from "./StoreModel.ts";
import { CheckoutPageModel } from "./CheckoutPageModel.ts";
import { ThemeCustomizationModel } from "./ThemeCustomizationModel.ts";

@Entity()
export class CheckoutThemeModel extends BaseModel implements ICheckoutTheme {
	@Property({ type: t.string })
	name: string;

	@Property({ type: t.integer })
	version: number;

	@ManyToOne(() => StoreModel)
	store: StoreModel;

	@OneToMany(
		() => ThemeCustomizationModel,
		(customization) => customization.theme,
	)
	private _customizations = new Collection<ThemeCustomizationModel>(this);

	get customizations(): ThemeCustomizationModel[] {
		return this._customizations.getItems();
	}

	@OneToMany(
		() => CheckoutPageModel,
		(page) => page.theme,
	)
	private _checkoutPages = new Collection<CheckoutPageModel>(this);

	get checkoutPages(): CheckoutPageModel[] {
		return this._checkoutPages.getItems();
	}

	constructor({
		name,
		version,
		store,
	}: Pick<CheckoutThemeModel, "name" | "version" | "store">) {
		super();
		this.name = name;
		this.version = version;
		this.store = store;
	}
}
