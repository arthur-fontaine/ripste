import type { Insertable } from "../../types/insertable.ts";
import type { IStore } from "./IStore.ts";
import type { IUser } from "./IUser.ts";

export interface IStoreStatus {
	id: string;
	status: "pending" | "active" | "suspended" | "refused";
	reason: string | null;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date | null;

	store: IStore;
	changedByUser: IUser;
}

export type IInsertStoreStatus = Insertable<
	IStoreStatus,
	"store" | "changedByUser"
> & {
	storeId: IStore["id"];
	changedByUserId: IUser["id"];
};
