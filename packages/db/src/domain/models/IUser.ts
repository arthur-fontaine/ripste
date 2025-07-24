import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IUserProfileTable } from "./IUserProfile.ts";
import type { IStoreMemberTable } from "./IStoreMember.ts";
import type { IRefundTable } from "./IRefund.ts";
import type { ICompanyTable } from "./ICompany.ts";

export interface IUserTable extends IBaseModel {
	email: string;
	passwordHash: string;
	emailVerified: boolean;
	permissionLevel: "admin" | "user";
	profile: ISU.SingleReference<IUserProfileTable | null, "profileId", "id">;
	company: ISU.SingleReference<ICompanyTable | null, "companyId", "id">;
	storeMembers: ISU.ManyReference<IStoreMemberTable>;
	initiatedRefunds: ISU.ManyReference<IRefundTable>;
}

export interface IUser extends ISU.Selectable<IUserTable> {}
export interface IInsertUser extends ISU.Insertable<IUserTable> {}
export interface IUpdateUser extends ISU.Updateable<IUserTable> {}

export const generateFakeUser = createFakeGenerator<IUser>("IUser", __filename);
export const generateFakeInsertUser = createFakeGenerator<IInsertUser>(
	"IInsertUser",
	__filename,
);
