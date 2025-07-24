import { Entity, Property, t, OneToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IUserProfile,
	IInsertUserProfile,
} from "../../../domain/models/IUserProfile.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";

@Entity()
export class MikroOrmUserProfileModel
	extends BaseModel
	implements IUserProfile
{
	constructor(params: IInsertUserProfile) {
		super();
		this._em.assign(this, params as never);
	}

	@Property({ type: t.string })
	firstName!: string;

	@Property({ type: t.string })
	lastName!: string;

	@Property({ type: t.string, nullable: true })
	phone!: string | null;

	@Property({ type: t.string })
	fullName!: string;

	@OneToOne(() => MikroOrmUserModel, { mappedBy: "profile" })
	user!: MikroOrmUserModel;

	get userId(): string {
		return this.user.id;
	}
}
