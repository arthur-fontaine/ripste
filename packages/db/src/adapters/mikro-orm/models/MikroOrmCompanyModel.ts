import {
	Entity,
	Property,
	t,
	OneToMany,
	Collection,
	OneToOne,
} from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	ICompany,
	IInsertCompany,
} from "../../../domain/models/ICompany.ts";
import { MikroOrmStoreModel } from "./MikroOrmStoreModel.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";

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

	@Property({ type: t.string, unique: true })
	kbis!: string;

	@Property({ type: t.string, nullable: true })
	vatNumber!: string | null;

	@Property({ type: t.string, nullable: true })
	address!: string | null;

	@OneToOne(
		() => MikroOrmUserModel,
		(user) => user.company,
		{ owner: true },
	)
	user!: MikroOrmUserModel;

	get userId(): string {
		return this.user.id;
	}

	set userId(userId: string) {
		this.user = this._em.getReference(MikroOrmUserModel, userId);
	}

	@OneToMany(
		() => MikroOrmStoreModel,
		(store) => store.company,
	)
	_stores = new Collection<MikroOrmStoreModel>(this);
	get stores(): MikroOrmStoreModel[] {
		return this._stores.getItems();
	}
}
