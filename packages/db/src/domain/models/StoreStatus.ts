import * as z from "./utils/zod-db.ts";
import { Store } from "./Store.ts";
import { User } from "./User.ts";
import { zocker } from "zocker";

const storeStatusTable = z.table({
	id: z.string(),
	status: z.enum(["pending", "active", "suspended", "refused"]),
	reason: z.nullable(z.string()),
	isActive: z.boolean(),
	...z.timestamps(),
	store: z.relation.one("storeId", () => Store, "id"),
	changedByUser: z.relation.one("changedByUserId", () => User, "id"),
});

export const StoreStatus = storeStatusTable.select;
export interface StoreStatus extends z.infer<typeof StoreStatus> {}
export const generateFakeStoreStatus = zocker(StoreStatus).generate;

export const StoreStatusInsert = storeStatusTable.insert;
export interface StoreStatusInsert extends z.infer<typeof StoreStatusInsert> {}
export const generateFakeStoreStatusInsert = zocker(StoreStatusInsert).generate;

export const StoreStatusUpdate = storeStatusTable.update;
export interface StoreStatusUpdate extends z.infer<typeof StoreStatusUpdate> {}
export const generateFakeStoreStatusUpdate = zocker(StoreStatusUpdate).generate;
