import {
	Entity,
	Property,
	t,
	ManyToOne,
	OneToMany,
	Collection,
} from "@mikro-orm/core";
import type { IStore } from "../../../domain/models/IStore.ts";
import { BaseModel } from "./BaseModel.ts";
import { CompanyModel } from "./CompanyModel.ts";
import { StoreStatusModel } from "./StoreStatusModel.ts";
import { StoreMemberModel } from "./StoreMemberModel.ts";
import { ApiCredentialModel } from "./ApiCredentialModel.ts";
import { CheckoutThemeModel } from "./CheckoutThemeModel.ts";
import { TransactionModel } from "./TransactionModel.ts";

@Entity()
export class StoreModel extends BaseModel implements IStore {
	@Property({ type: t.string })
	name: string;

	@Property({ type: t.string, unique: true })
	slug: string;

	@Property({ type: t.string })
	contactEmail: string;

	@Property({ type: t.string, nullable: true })
	contactPhone: string | null;

	@ManyToOne(() => CompanyModel, { nullable: true })
	company: CompanyModel | null;

	get companyId(): string | null {
		return this.company ? this.company.id : null;
	}

	@OneToMany(
		() => StoreStatusModel,
		(status) => status.store,
	)
	private _storeStatuses = new Collection<StoreStatusModel>(this);

	get storeStatuses(): StoreStatusModel[] {
		return this._storeStatuses.getItems();
	}

	@OneToMany(
		() => StoreMemberModel,
		(member) => member.store,
	)
	private _storeMembers = new Collection<StoreMemberModel>(this);

	get storeMembers(): StoreMemberModel[] {
		return this._storeMembers.getItems();
	}

	@OneToMany(
		() => ApiCredentialModel,
		(credential) => credential.store,
	)
	private _apiCredentials = new Collection<ApiCredentialModel>(this);

	get apiCredentials(): ApiCredentialModel[] {
		return this._apiCredentials.getItems();
	}

	@OneToMany(
		() => CheckoutThemeModel,
		(theme) => theme.store,
	)
	private _checkoutThemes = new Collection<CheckoutThemeModel>(this);

	get checkoutThemes(): CheckoutThemeModel[] {
		return this._checkoutThemes.getItems();
	}

	@OneToMany(
		() => TransactionModel,
		(transaction) => transaction.store,
	)
	private _transactions = new Collection<TransactionModel>(this);

	get transactions(): TransactionModel[] {
		return this._transactions.getItems();
	}

	constructor({
		name,
		slug,
		contactEmail,
		contactPhone,
		company,
	}: Pick<StoreModel, "name" | "slug" | "contactEmail"> &
		Partial<Pick<StoreModel, "contactPhone" | "company">>) {
		super();
		this.name = name;
		this.slug = slug;
		this.contactEmail = contactEmail;
		this.contactPhone = contactPhone ?? null;
		this.company = company ?? null;
	}
}
