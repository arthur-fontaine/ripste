import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IUserTable } from "./IUser.ts";

export interface IUserProfileTable extends IBaseModel {
	firstName: string;
	lastName: string;
	phone: string | null;
	user: ISU.SingleReference<IUserTable, "userId", "id">;
	fullName: ISU.Generated<string>;
}

export interface IUserProfile extends ISU.Selectable<IUserProfileTable> {}
export interface IInsertUserProfile extends ISU.Insertable<IUserProfileTable> {}
export interface IUpdateUserProfile extends ISU.Updateable<IUserProfileTable> {}

export const generateFakeUserProfile = createFakeGenerator<IUserProfile>(
	"IUserProfile",
	__filename,
);
export const generateFakeInsertUserProfile =
	createFakeGenerator<IInsertUserProfile>("IInsertUserProfile", __filename);
