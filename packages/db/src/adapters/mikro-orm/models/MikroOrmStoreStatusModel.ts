import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IStoreStatus,
	IStoreStatusInsert,
} from "../../../domain/models/StoreStatus.ts";
import { MikroOrmStoreModel } from "./MikroOrmStoreModel.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";

@Entity()
export class MikroOrmStoreStatusModel
	extends BaseModel
	implements IStoreStatus
{
	constructor(params: IStoreStatusInsert) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	status!: "pending" | "active" | "suspended" | "refused";

	@Property({ type: t.string, nullable: true })
	reason!: string | null;

	@Property({ type: t.boolean })
	isActive!: boolean;

	@ManyToOne(() => MikroOrmStoreModel)
	store!: MikroOrmStoreModel;

	@ManyToOne(() => MikroOrmUserModel)
	changedByUser!: MikroOrmUserModel;
}
