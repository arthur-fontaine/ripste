import type { Insertable } from "../../types/insertable.ts";
import type { IApiCredential } from "./IApiCredential.ts";
import type { IRefund } from "./IRefund.ts";
import type { IStoreMember } from "./IStoreMember.ts";
import type { IUserProfile } from "./IUserProfile.ts";

export interface IUser {
	id: string;
	email: string;
	passwordHash: string;
	emailVerified: boolean;
	permissionLevel: "admin" | "user";
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;

	profile: IUserProfile | null;
	storeMembers: IStoreMember[];
	createdCredentials: IApiCredential[];
	initiatedRefunds: IRefund[];
}

export type IInsertUser = Insertable<
	IUser,
	"profile" | "storeMembers" | "createdCredentials" | "initiatedRefunds"
>;
