import type { Insertable } from "../../types/insertable.ts";
import type { IStore } from "./IStore.ts";
import type { IUser } from "./IUser.ts";

export interface IStoreMember {
	id: string;
	permissionLevel: "owner";
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;

	user: IUser;
	store: IStore;
}

export type IInsertStoreMember = Insertable<IStoreMember, "user" | "store"> & {
	userId: IUser["id"];
	storeId: IStore["id"];
};
