import type { Insertable } from "../../types/insertable.ts";
import type { IStore } from "./IStore.ts";
import type { IUser } from "./IUser.ts";

export interface IStoreMember {
	id: string;
	permissionLevel: "owner";
	createdAt: Date;
	updatedAt: Date | null;

	user: IUser | null;
	store: IStore | null;
}

export type IInsertStoreMember = Insertable<IStoreMember, "user" | "store"> & {
	userId: IUser["id"] | null;
	storeId: IStore["id"] | null;
};
