import { Entity, Property, t, OneToMany, Collection } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	ICompany,
	IInsertCompany,
} from "../../../domain/models/ICompany.ts";
import { MikroOrmStoreModel } from "./MikroOrmStoreModel.ts";

@Entity()
export class MikroOrmCompanyModel extends BaseModel implements ICompany {
	constructor(params: IInsertCompany) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	legalName!: string;

	@Property({ type: t.string, nullable: true })
	tradeName!: string | null;

	@Property({ type: t.string })
	kbis!: string;

	@Property({ type: t.string, nullable: true })
	vatNumber!: string | null;

	@Property({ type: t.string, nullable: true })
	address!: string | null;

	@OneToMany(
		() => MikroOrmStoreModel,
		(store) => store.company,
	)
	_stores = new Collection<MikroOrmStoreModel>(this);
	get stores(): MikroOrmStoreModel[] {
		return this._stores.getItems();
	}
}
