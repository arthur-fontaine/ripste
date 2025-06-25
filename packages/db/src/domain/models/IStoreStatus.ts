import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IStoreTable } from "./IStore.ts";
import type { IUserTable } from "./IUser.ts";

export interface IStoreStatusTable extends IBaseModel {
	status: "pending" | "active" | "suspended" | "refused";
	reason: string | null;
	isActive: boolean;
	store: ISU.SingleReference<IStoreTable, "storeId", "id">;
	changedByUser: ISU.SingleReference<IUserTable, "changedByUserId", "id">;
}

export interface IStoreStatus extends ISU.Selectable<IStoreStatusTable> {}
export interface IInsertStoreStatus extends ISU.Insertable<IStoreStatusTable> {}
export interface IUpdateStoreStatus extends ISU.Updateable<IStoreStatusTable> {}

export const generateFakeStoreStatus = createFakeGenerator<IStoreStatus>(
	"IStoreStatus",
	__filename,
);

export const generateFakeInsertStoreStatus =
	createFakeGenerator<IInsertStoreStatus>("IInsertStoreStatus", __filename);
