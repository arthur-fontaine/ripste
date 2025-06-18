import { User } from "./User.ts";
import * as z from "./utils/zod-db.ts";
import { zocker } from "zocker";

const userProfileTable = z.table({
	id: z.generated(z.uuid()),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.nullable(z.string()),
	fullName: z.generated(z.string()),
	...z.timestamps(),
	user: z.relation.one(
		"userId",
		(): z.ZodMiniType<Pick<User, "id">> => User,
		"id",
	),
});

export const UserProfile = userProfileTable.select;
export interface UserProfile extends z.infer<typeof UserProfile> {
	user: User;
}
export const generateFakeUserProfile = zocker(UserProfile).generate;

export const UserProfileInsert = userProfileTable.insert;
export interface UserProfileInsert extends z.infer<typeof UserProfileInsert> {}
export const generateFakeUserProfileInsert = zocker(UserProfileInsert).generate;

export const UserProfileUpdate = userProfileTable.update;
export interface UserProfileUpdate extends z.infer<typeof UserProfileUpdate> {}
export const generateFakeUserProfileUpdate = zocker(UserProfileUpdate).generate;
