import type { IInsertUser, IUser } from "../models/IUser.ts";
import type { IInsertUserProfile } from "../models/IUserProfile.ts";

export interface IUserRepository {
	findById(id: string): Promise<IUser | null>;
	findMany(params: {
		email?: string;
		permissionLevel?: IUser["permissionLevel"];
		emailVerified?: boolean;
	}): Promise<IUser[]>;
	create(user: IInsertUser): Promise<IUser>;
	createWithProfile(
		user: IInsertUser,
		profile: IInsertUserProfile,
	): Promise<IUser>;
	update(id: string, user: IInsertUser): Promise<IUser>;
	delete(id: string): Promise<void>;
	hardDelete(id: string): Promise<void>;
}
