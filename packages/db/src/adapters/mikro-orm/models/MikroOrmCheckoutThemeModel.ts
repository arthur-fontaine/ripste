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
	ICheckoutTheme,
	IInsertCheckoutTheme,
} from "../../../domain/models/ICheckoutTheme.ts";
import { MikroOrmStoreModel } from "./MikroOrmStoreModel.ts";
import { MikroOrmThemeCustomizationModel } from "./MikroOrmThemeCustomizationModel.ts";
import { MikroOrmCheckoutPageModel } from "./MikroOrmCheckoutPageModel.ts";

@Entity()
export class MikroOrmCheckoutThemeModel
	extends BaseModel
	implements ICheckoutTheme
{
	constructor(params: IInsertCheckoutTheme) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	name!: string;

	@Property({ type: t.integer })
	version!: number;

	@ManyToOne(() => MikroOrmStoreModel)
	store!: MikroOrmStoreModel;

	get storeId(): string {
		return this.store.id;
	}

	@OneToMany(
		() => MikroOrmThemeCustomizationModel,
		(custom) => custom.theme,
	)
	_customizations = new Collection<MikroOrmThemeCustomizationModel>(this);
	get customizations(): MikroOrmThemeCustomizationModel[] {
		return this._customizations.getItems();
	}

	@OneToMany(
		() => MikroOrmCheckoutPageModel,
		(page) => page.theme,
	)
	_checkoutPages = new Collection<MikroOrmCheckoutPageModel>(this);
	get checkoutPages(): MikroOrmCheckoutPageModel[] {
		return this._checkoutPages.getItems();
	}
}
