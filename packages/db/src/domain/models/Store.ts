import * as z from "./utils/zod-db.ts";
import { type ITransaction, Transaction } from "./Transaction.ts";
import { CheckoutTheme, type ICheckoutTheme } from "./CheckoutTheme.ts";
import { ApiCredential } from "./ApiCredential.ts";
import { StoreStatus, type IStoreStatus } from "./StoreStatus.ts";
import { type IStoreMember, StoreMember } from "./StoreMember.ts";
import { Company, type ICompany } from "./Company.ts";
import { zocker } from "zocker";

const storeTable = z.table({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	contactEmail: z.string(),
	contactPhone: z.nullable(z.string()),
	...z.timestamps(),
	company: z.relation.one(
		"companyId",
		(): z.ZodMiniNullable<z.ZodMiniType<Pick<ICompany, "id">>> =>
			z.nullable(Company),
		"id",
	),
	storeMembers: z.relation.many(
		(): z.ZodMiniType<Pick<IStoreMember, "id">> => StoreMember,
	),
	storeStatuses: z.relation.many(
		(): z.ZodMiniType<Pick<IStoreStatus, "id">> => StoreStatus,
	),
	apiCredentials: z.relation.many(() => ApiCredential),
	checkoutThemes: z.relation.many(() => CheckoutTheme),
	transactions: z.relation.many(
		(): z.ZodMiniType<Pick<ITransaction, "id">> => Transaction,
	),
});

export const Store = storeTable.select;
export interface IStore extends z.infer<typeof Store> {
	company: ICompany | null;
	storeMembers: IStoreMember[];
	checkoutThemes: ICheckoutTheme[];
	transactions: ITransaction[];
}
export const generateFakeStore = () => zocker(Store).generate();

export const StoreInsert = storeTable.insert;
export interface IStoreInsert extends z.infer<typeof StoreInsert> {}
export const generateFakeStoreInsert = () => zocker(StoreInsert).generate();

export const StoreUpdate = storeTable.update;
export interface IStoreUpdate extends z.infer<typeof StoreUpdate> {}
export const generateFakeStoreUpdate = () => zocker(StoreUpdate).generate();
