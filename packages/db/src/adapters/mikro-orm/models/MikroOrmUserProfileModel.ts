import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IUserProfile,
	IUserProfileInsert,
} from "../../../domain/models/UserProfile.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";

@Entity()
export class MikroOrmUserProfileModel
	extends BaseModel
	implements IUserProfile
{
	constructor(params: IUserProfileInsert) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	firstName!: string;

	@Property({ type: t.string })
	lastName!: string;

	@Property({ type: t.string, nullable: true })
	phone!: string | null;

	@Property({ type: t.string })
	fullName!: string;

	@ManyToOne(() => MikroOrmUserModel)
	user!: MikroOrmUserModel;
}
