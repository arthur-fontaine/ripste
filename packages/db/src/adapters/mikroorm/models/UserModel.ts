import {
	Entity,
	OneToOne,
	Property,
	t,
	Enum,
	Cascade,
	OneToMany,
	Collection,
} from "@mikro-orm/core";
import { BaseModel } from "./BaseModel.ts";
import type { IUser } from "../../../domain/models/IUser.ts";
import { UserProfileModel } from "./UserProfileModel.ts";
import { StoreMemberModel } from "./StoreMemberModel.ts";
import { ApiCredentialModel } from "./ApiCredentialModel.ts";
import { RefundModel } from "./RefundModel.ts";

const PermissionLevel = {
	ADMIN: "admin",
	USER: "user",
} as const;

@Entity()
export class UserModel extends BaseModel implements IUser {
	@Property({ unique: true, type: t.string })
	email: string;

	@Property({ type: t.string })
	passwordHash: string;

	@Property({ type: t.boolean, default: false })
	emailVerified: boolean;

	@Enum(() => PermissionLevel)
	permissionLevel: "admin" | "user";

	@Property({ type: t.datetime, nullable: true })
	override deletedAt: Date | null;

	@OneToOne(
		() => UserProfileModel,
		(profile) => profile.user,
		{
			cascade: [Cascade.REMOVE],
		},
	)
	profile: UserProfileModel | null;

	@OneToMany(
		() => StoreMemberModel,
		(member) => member.user,
	)
	private _storeMembers = new Collection<StoreMemberModel>(this);

	get storeMembers(): StoreMemberModel[] {
		return this._storeMembers.getItems();
	}

	@OneToMany(
		() => ApiCredentialModel,
		(credential) => credential.createdByUser,
	)
	private _createdCredentials = new Collection<ApiCredentialModel>(this);

	get createdCredentials(): ApiCredentialModel[] {
		return this._createdCredentials.getItems();
	}

	@OneToMany(
		() => RefundModel,
		(refund) => refund.initiatedByUser,
	)
	private _initiatedRefunds = new Collection<RefundModel>(this);

	get initiatedRefunds(): RefundModel[] {
		return this._initiatedRefunds.getItems();
	}

	constructor({
		email,
		passwordHash,
		profile,
		emailVerified = false,
		permissionLevel = PermissionLevel.USER,
		deletedAt = null,
	}: Pick<UserModel, "email" | "passwordHash"> &
		Partial<
			Pick<
				UserModel,
				"profile" | "emailVerified" | "permissionLevel" | "deletedAt"
			>
		>) {
		super();
		this.email = email;
		this.passwordHash = passwordHash;
		this.profile = profile ?? null;
		this.emailVerified = emailVerified;
		this.permissionLevel = permissionLevel;
		this.deletedAt = deletedAt;
	}
}
