import {
	Entity,
	Property,
	t,
	ManyToOne,
	OneToMany,
	Collection,
} from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type { IStore, IInsertStore } from "../../../domain/models/IStore.ts";
import { MikroOrmCompanyModel } from "./MikroOrmCompanyModel.ts";
import { MikroOrmStoreMemberModel } from "./MikroOrmStoreMemberModel.ts";
import { MikroOrmStoreStatusModel } from "./MikroOrmStoreStatusModel.ts";
import { MikroOrmCheckoutThemeModel } from "./MikroOrmCheckoutThemeModel.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";

@Entity()
export class MikroOrmStoreModel extends BaseModel implements IStore {
	constructor(params: IInsertStore) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	name!: string;

	@Property({ type: t.string })
	slug!: string;

	@Property({ type: t.string })
	contactEmail!: string;

	@Property({ type: t.string, nullable: true })
	contactPhone!: string | null;

	@ManyToOne(() => MikroOrmCompanyModel, { nullable: true })
	company: MikroOrmCompanyModel | null = null;

	get companyId(): string | null {
		return this.company ? this.company.id : null;
	}

	set companyId(companyId: string | null) {
		if (companyId !== null)
			this.company = this._em.getReference(MikroOrmCompanyModel, companyId);
	}

	@OneToMany(
		() => MikroOrmStoreMemberModel,
		(member) => member.store,
	)
	_storeMembers = new Collection<MikroOrmStoreMemberModel>(this);
	get storeMembers(): MikroOrmStoreMemberModel[] {
		return this._storeMembers.getItems();
	}

	@OneToMany(
		() => MikroOrmStoreStatusModel,
		(status) => status.store,
	)
	_storeStatuses = new Collection<MikroOrmStoreStatusModel>(this);
	get storeStatuses(): MikroOrmStoreStatusModel[] {
		return this._storeStatuses.getItems();
	}

	@OneToMany(
		() => MikroOrmCheckoutThemeModel,
		(theme) => theme.store,
	)
	_checkoutThemes = new Collection<MikroOrmCheckoutThemeModel>(this);
	get checkoutThemes(): MikroOrmCheckoutThemeModel[] {
		return this._checkoutThemes.getItems();
	}

	@OneToMany(
		() => MikroOrmTransactionModel,
		(tx) => tx.store,
	)
	_transactions = new Collection<MikroOrmTransactionModel>(this);
	get transactions(): MikroOrmTransactionModel[] {
		return this._transactions.getItems();
	}
}
