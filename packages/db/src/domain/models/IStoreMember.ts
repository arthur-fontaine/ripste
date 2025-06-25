import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IUserTable } from "./IUser.ts";
import type { IStoreTable } from "./IStore.ts";

export interface IStoreMemberTable extends IBaseModel {
	permissionLevel: "owner";
	user: ISU.SingleReference<IUserTable, "userId", "id">;
	store: ISU.SingleReference<IStoreTable, "storeId", "id">;
}

export interface IStoreMember extends ISU.Selectable<IStoreMemberTable> {}
export interface IInsertStoreMember extends ISU.Insertable<IStoreMemberTable> {}
export interface IUpdateStoreMember extends ISU.Updateable<IStoreMemberTable> {}

export const generateFakeStoreMember = createFakeGenerator<IStoreMember>(
	"IStoreMember",
	__filename,
);

export const generateFakeInsertStoreMember =
	createFakeGenerator<IInsertStoreMember>("IInsertStoreMember", __filename);
