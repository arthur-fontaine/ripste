import { Entity, Property, t, OneToMany, Collection } from "@mikro-orm/core";
import type { ICompany } from "../../../domain/models/ICompany.ts";
import { BaseModel } from "./BaseModel.ts";
import { StoreModel } from "./StoreModel.ts";

@Entity()
export class CompanyModel extends BaseModel implements ICompany {
	@Property({ type: t.string })
	legalName: string;

	@Property({ type: t.string, nullable: true })
	tradeName: string | null;

	@Property({ type: t.string, unique: true })
	kbis: string;

	@Property({ type: t.string, nullable: true })
	vatNumber: string | null;

	@Property({ type: t.string, nullable: true })
	address: string | null;

	@OneToMany(
		() => StoreModel,
		(store) => store.company,
	)
	private _stores = new Collection<StoreModel>(this);

	get stores(): StoreModel[] {
		return this._stores.getItems();
	}
	constructor({
		legalName,
		tradeName,
		kbis,
		vatNumber,
		address,
	}: Pick<CompanyModel, "legalName" | "kbis"> &
		Partial<Pick<CompanyModel, "tradeName" | "vatNumber" | "address">>) {
		super();
		this.legalName = legalName;
		this.tradeName = tradeName ?? null;
		this.kbis = kbis;
		this.vatNumber = vatNumber ?? null;
		this.address = address ?? null;
	}
}
