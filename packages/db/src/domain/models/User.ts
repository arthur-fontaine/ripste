import * as z from "./utils/zod-db.ts";
import { ApiCredential } from "./ApiCredential.ts";
import { Refund } from "./Refund.ts";
import { StoreMember } from "./StoreMember.ts";
import { UserProfile } from "./UserProfile.ts";
import { zocker } from "zocker";

const userTable = z.table({
	id: z.string(),
	email: z.string(),
	passwordHash: z.string(),
	emailVerified: z.boolean(),
	permissionLevel: z.enum(["admin", "user"]),
	...z.timestamps(),
	profile: z.relation.one("profileId", () => z.nullable(UserProfile), "id"),
	storeMembers: z.relation.many(
		(): z.ZodMiniType<Pick<StoreMember, "id">> => StoreMember,
	),
	createdCredentials: z.relation.many(() => ApiCredential),
	initiatedRefunds: z.relation.many(() => Refund),
});

export const User = userTable.select;
export interface User extends z.infer<typeof User> {
	storeMembers: StoreMember[];
}
export const generateFakeUser = zocker(User).generate;

export const UserInsert = userTable.insert;
export interface UserInsert extends z.infer<typeof UserInsert> {}
export const generateFakeUserInsert = zocker(UserInsert).generate;

export const UserUpdate = userTable.update;
export interface UserUpdate extends z.infer<typeof UserUpdate> {}
export const generateFakeUserUpdate = zocker(UserUpdate).generate;
