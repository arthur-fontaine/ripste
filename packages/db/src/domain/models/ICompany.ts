import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IStoreTable } from "./IStore.ts";

export interface ICompanyTable extends IBaseModel {
	legalName: string;
	tradeName: string | null;
	kbis: string;
	vatNumber: string | null;
	address: string | null;
	stores: ISU.ManyReference<IStoreTable>;
}

export interface ICompany extends ISU.Selectable<ICompanyTable> {}
export interface IInsertCompany extends ISU.Insertable<ICompanyTable> {}
export interface IUpdateCompany extends ISU.Updateable<ICompanyTable> {}

export const generateFakeCompany = createFakeGenerator<ICompany>(
	"ICompany",
	__filename,
);
export const generateFakeInsertCompany = createFakeGenerator<IInsertCompany>(
	"IInsertCompany",
	__filename,
);
