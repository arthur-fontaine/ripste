import * as z from "./utils/zod-db.ts";
import { User } from "./User.ts";
import { Store } from "./Store.ts";
import { zocker } from "zocker";

const storeMemberTable = z.table({
	id: z.string(),
	permissionLevel: z.enum(["owner"]),
	...z.timestamps(),
	user: z.relation.one("userId", () => User, "id"),
	store: z.relation.one("storeId", () => Store, "id"),
});

export const StoreMember = storeMemberTable.select;
export interface StoreMember extends z.infer<typeof StoreMember> {}
export const generateFakeStoreMember = zocker(StoreMember).generate;

export const StoreMemberInsert = storeMemberTable.insert;
export interface StoreMemberInsert extends z.infer<typeof StoreMemberInsert> {}
export const generateFakeStoreMemberInsert = zocker(StoreMemberInsert).generate;

export const StoreMemberUpdate = storeMemberTable.update;
export interface StoreMemberUpdate extends z.infer<typeof StoreMemberUpdate> {}
export const generateFakeStoreMemberUpdate = zocker(StoreMemberUpdate).generate;
