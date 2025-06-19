import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IStoreMember,
	IStoreMemberInsert,
} from "../../../domain/models/StoreMember.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";
import { MikroOrmStoreModel } from "./MikroOrmStoreModel.ts";

@Entity()
export class MikroOrmStoreMemberModel
	extends BaseModel
	implements IStoreMember
{
	constructor(params: IStoreMemberInsert) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	permissionLevel!: "owner";

	@ManyToOne(() => MikroOrmUserModel)
	user!: MikroOrmUserModel;

	@ManyToOne(() => MikroOrmStoreModel)
	store!: MikroOrmStoreModel;
}
