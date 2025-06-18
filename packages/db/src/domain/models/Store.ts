import * as z from "./utils/zod-db.ts";
import { Transaction } from "./Transaction.ts";
import { CheckoutTheme } from "./CheckoutTheme.ts";
import { ApiCredential } from "./ApiCredential.ts";
import { StoreStatus } from "./StoreStatus.ts";
import { StoreMember } from "./StoreMember.ts";
import { Company } from "./Company.ts";
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
		(): z.ZodMiniNullable<z.ZodMiniType<Pick<Company, "id">>> =>
			z.nullable(Company),
		"id",
	),
	storeMembers: z.relation.many(
		(): z.ZodMiniType<Pick<StoreMember, "id">> => StoreMember,
	),
	storeStatuses: z.relation.many(
		(): z.ZodMiniType<Pick<StoreStatus, "id">> => StoreStatus,
	),
	apiCredentials: z.relation.many(() => ApiCredential),
	checkoutThemes: z.relation.many(() => CheckoutTheme),
	transactions: z.relation.many(
		(): z.ZodMiniType<Pick<Transaction, "id">> => Transaction,
	),
});

export const Store = storeTable.select;
export interface Store extends z.infer<typeof Store> {
	company: Company | null;
	storeMembers: StoreMember[];
	checkoutThemes: CheckoutTheme[];
	transactions: Transaction[];
}
export const generateFakeStore = zocker(Store).generate;

export const StoreInsert = storeTable.insert;
export interface StoreInsert extends z.infer<typeof StoreInsert> {}
export const generateFakeStoreInsert = zocker(StoreInsert).generate;

export const StoreUpdate = storeTable.update;
export interface StoreUpdate extends z.infer<typeof StoreUpdate> {}
export const generateFakeStoreUpdate = zocker(StoreUpdate).generate;
