import { Entity, Property, t, ManyToOne, Enum } from "@mikro-orm/core";
import type { IStoreStatus } from "../../../domain/models/IStoreStatus.ts";
import { BaseModel } from "./BaseModel.ts";
import { StoreModel } from "./StoreModel.ts";
import { UserModel } from "./UserModel.ts";

const StoreStatus = {
	ACTIVE: "active",
	SUSPENDED: "suspended",
	PENDING: "pending",
	REFUSED: "refused",
} as const;

@Entity()
export class StoreStatusModel extends BaseModel implements IStoreStatus {
	@ManyToOne(() => StoreModel)
	store: StoreModel;

	@Enum(() => StoreStatus)
	status: "active" | "suspended" | "pending" | "refused";

	@Property({ type: t.string, nullable: true })
	reason: string | null;

	@ManyToOne(() => UserModel)
	changedByUser: UserModel;

	@Property({ type: t.boolean, default: true })
	isActive: boolean;

	constructor({
		store,
		status,
		changedByUser,
		reason,
		isActive = true,
	}: Pick<StoreStatusModel, "store" | "status" | "changedByUser"> &
		Partial<Pick<StoreStatusModel, "reason" | "isActive">>) {
		super();
		this.store = store;
		this.status = status;
		this.changedByUser = changedByUser;
		this.reason = reason ?? null;
		this.isActive = isActive;
	}
}
