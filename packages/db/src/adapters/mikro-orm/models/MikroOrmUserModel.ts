import { Entity, Property, t, OneToMany, Collection } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type { IUser, IInsertUser } from "../../../domain/models/IUser.ts";
import { MikroOrmUserProfileModel } from "./MikroOrmUserProfileModel.ts";
import { MikroOrmStoreMemberModel } from "./MikroOrmStoreMemberModel.ts";
import { MikroOrmApiCredentialModel } from "./MikroOrmApiCredentialModel.ts";
import { MikroOrmRefundModel } from "./MikroOrmRefundModel.ts";

@Entity()
export class MikroOrmUserModel extends BaseModel implements IUser {
	constructor(params: IInsertUser) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	email!: string;

	@Property({ type: t.string })
	passwordHash!: string;

	@Property({ type: t.boolean })
	emailVerified!: boolean;

	@Property({ type: t.string })
	permissionLevel!: "admin" | "user";

	@OneToMany(
		() => MikroOrmUserProfileModel,
		(profile) => profile.user,
	)
	_profile = new Collection<MikroOrmUserProfileModel>(this);
	get profile(): MikroOrmUserProfileModel | null {
		return this._profile.getItems()[0] ?? null;
	}

	get profileId(): string | null {
		return this.profile ? this.profile.id : null;
	}

	@OneToMany(
		() => MikroOrmStoreMemberModel,
		(member) => member.user,
	)
	_storeMembers = new Collection<MikroOrmStoreMemberModel>(this);
	get storeMembers(): MikroOrmStoreMemberModel[] {
		return this._storeMembers.getItems();
	}

	@OneToMany(
		() => MikroOrmApiCredentialModel,
		(cred) => cred.createdByUser,
	)
	_createdCredentials = new Collection<MikroOrmApiCredentialModel>(this);
	get createdCredentials(): MikroOrmApiCredentialModel[] {
		return this._createdCredentials.getItems();
	}

	@OneToMany(
		() => MikroOrmRefundModel,
		(refund) => refund.initiatedByUser,
	)
	_initiatedRefunds = new Collection<MikroOrmRefundModel>(this);
	get initiatedRefunds(): MikroOrmRefundModel[] {
		return this._initiatedRefunds.getItems();
	}
}
