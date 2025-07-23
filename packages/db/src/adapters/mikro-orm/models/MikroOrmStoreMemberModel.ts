import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IStoreMember,
	IInsertStoreMember,
} from "../../../domain/models/IStoreMember.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";
import { MikroOrmStoreModel } from "./MikroOrmStoreModel.ts";

@Entity()
export class MikroOrmStoreMemberModel
	extends BaseModel
	implements IStoreMember
{
	constructor(params: IInsertStoreMember) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	permissionLevel!: "owner";

	@ManyToOne(() => MikroOrmUserModel)
	user!: MikroOrmUserModel;

	get userId(): string {
		return this.user.id;
	}

	set userId(userId: string) {
		this.user = this._em.getReference(MikroOrmUserModel, userId);
	}

	@ManyToOne(() => MikroOrmStoreModel)
	store!: MikroOrmStoreModel;

	get storeId(): string {
		return this.store.id;
	}

	set storeId(storeId: string) {
		this.store = this._em.getReference(MikroOrmStoreModel, storeId);
	}
}
