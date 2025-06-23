import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { ICompanyTable } from "./ICompany.ts";
import type { IStoreMemberTable } from "./IStoreMember.ts";
import type { IStoreStatusTable } from "./IStoreStatus.ts";
import type { IApiCredentialTable } from "./IApiCredential.ts";
import type { ICheckoutThemeTable } from "./ICheckoutTheme.ts";
import type { ITransactionTable } from "./ITransaction.ts";

export interface IStoreTable extends IBaseModel {
	name: string;
	slug: string;
	contactEmail: string;
	contactPhone: string | null;
	company: ISU.SingleReference<ICompanyTable | null, "companyId", "id">;
	storeMembers: ISU.ManyReference<IStoreMemberTable>;
	storeStatuses: ISU.ManyReference<IStoreStatusTable>;
	apiCredentials: ISU.ManyReference<IApiCredentialTable>;
	checkoutThemes: ISU.ManyReference<ICheckoutThemeTable>;
	transactions: ISU.ManyReference<ITransactionTable>;
}

export interface IStore extends ISU.Selectable<IStoreTable> {}
export interface IInsertStore extends ISU.Insertable<IStoreTable> {}
export interface IUpdateStore extends ISU.Updateable<IStoreTable> {}

export const generateFakeStore = createFakeGenerator<IStore>(
	"IStore",
	__filename,
);
export const generateFakeInsertStore = createFakeGenerator<IInsertStore>(
	"IInsertStore",
	__filename,
);
