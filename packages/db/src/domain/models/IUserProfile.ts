import type { Insertable } from "../../types/insertable.ts";
import type { IUser } from "./IUser.ts";

export interface IUserProfile {
	id: string;
	firstName: string | null;
	lastName: string | null;
	phone: string | null;
	createdAt: Date;
	updatedAt: Date | null;

	user: IUser | null;

	fullName: string | null;
}

export type IInsertUserProfile = Insertable<IUserProfile, "user">;
