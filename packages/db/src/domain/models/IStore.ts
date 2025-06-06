import type { Insertable } from "../../types/insertable.ts";
import type { IApiCredential } from "./IApiCredential.ts";
import type { ICheckoutTheme } from "./ICheckoutTheme.ts";
import type { ICompany, IInsertCompany } from "./ICompany.ts";
import type { IStoreMember } from "./IStoreMember.ts";
import type { IStoreStatus } from "./IStoreStatus.ts";
import type { ITransaction } from "./ITransaction.ts";

export interface IStore {
	id: string;
	name: string;
	slug: string;
	contactEmail: string;
	contactPhone: string | null;
	createdAt: Date;
	updatedAt: Date | null;

	company: ICompany | null;
	storeMembers: IStoreMember[] | null;
	storeStatuses: IStoreStatus[] | null;
	apiCredentials: IApiCredential[] | null;
	checkoutThemes: ICheckoutTheme[] | null;
	transactions: ITransaction[] | null;
}

export type IInsertStore = Insertable<
	IStore,
	| "company"
	| "storeMembers"
	| "storeStatuses"
	| "apiCredentials"
	| "checkoutThemes"
	| "transactions"
> & { company: IInsertCompany | null } & {
	companyId: ICompany["id"] | null;
};
