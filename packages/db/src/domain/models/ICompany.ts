import type { Insertable } from "../../types/insertable.ts";
import type { IStore } from "./IStore.ts";

export interface ICompany {
	id: string;
	legalName: string;
	tradeName: string | null;
	kbis: string;
	vatNumber: string | null;
	address: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;

	stores: IStore[];
}

export type IInsertCompany = Insertable<ICompany, "stores">;
