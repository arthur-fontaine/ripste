import type { Insertable } from "../../types/insertable.ts";
import type { IUser } from "./IUser.ts";

export interface IUserProfile {
	id: string;
	firstName: string;
	lastName: string;
	phone: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;

	user: IUser;

	fullName: string;
}

export type IInsertUserProfile = Insertable<IUserProfile, "user"> & {
	userId: IUser["id"];
};
