import { Entity, ManyToOne, Enum, Index } from "@mikro-orm/core";
import type { IStoreMember } from "../../../domain/models/IStoreMember.ts";
import { BaseModel } from "./BaseModel.ts";
import { UserModel } from "./UserModel.ts";
import { StoreModel } from "./StoreModel.ts";

const PermissionLevel = {
	OWNER: "owner",
} as const;

@Entity()
@Index({ properties: ["user", "store"] })
export class StoreMemberModel extends BaseModel implements IStoreMember {
	@Enum(() => PermissionLevel)
	permissionLevel: "owner";

	@ManyToOne(() => UserModel, { nullable: false })
	user: UserModel;

	get userId(): string {
		return this.user.id;
	}

	@ManyToOne(() => StoreModel, { nullable: false })
	store: StoreModel;

	get storeId(): string {
		return this.store.id;
	}

	constructor({
		permissionLevel = PermissionLevel.OWNER,
		user,
		store,
	}: Pick<StoreMemberModel, "user" | "store"> &
		Partial<Pick<StoreMemberModel, "permissionLevel">>) {
		super();
		this.permissionLevel = permissionLevel;
		this.user = user;
		this.store = store;
	}
}
