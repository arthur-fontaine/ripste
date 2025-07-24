import {
	Entity,
	Property,
	t,
	OneToMany,
	Collection,
	OneToOne,
} from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type { IUser, IInsertUser } from "../../../domain/models/IUser.ts";
import { MikroOrmUserProfileModel } from "./MikroOrmUserProfileModel.ts";
import { MikroOrmStoreMemberModel } from "./MikroOrmStoreMemberModel.ts";
import { MikroOrmRefundModel } from "./MikroOrmRefundModel.ts";

@Entity()
export class MikroOrmUserModel extends BaseModel implements IUser {
	constructor(params: IInsertUser) {
		super();
		this._em.assign(this, params as never);
	}

	@Property({ type: t.string })
	email!: string;

	@Property({ type: t.string })
	passwordHash!: string;

	@Property({ type: t.boolean })
	emailVerified!: boolean;

	@Property({ type: t.string })
	permissionLevel!: "admin" | "user";

	@OneToOne(() => MikroOrmUserProfileModel, { nullable: true })
	profile!: MikroOrmUserProfileModel | null;

	get profileId(): string | null {
		return this.profile ? this.profile.id : null;
	}

	set profileId(profileId: string | null) {
		if (profileId === null) {
			this.profile = null;
			return;
		}
		this.profile = this._em.getReference(MikroOrmUserProfileModel, profileId);
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
		() => MikroOrmRefundModel,
		(refund) => refund.initiatedByUser,
	)
	_initiatedRefunds = new Collection<MikroOrmRefundModel>(this);
	get initiatedRefunds(): MikroOrmRefundModel[] {
		return this._initiatedRefunds.getItems();
	}
}
