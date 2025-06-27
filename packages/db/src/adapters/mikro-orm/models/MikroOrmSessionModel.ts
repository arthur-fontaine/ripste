import { Entity, Property, t, ManyToOne, type Ref } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type { IInsertSession } from "../../../domain/models/ISession.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";

@Entity()
export class MikroOrmSessionModel extends BaseModel {
	constructor(params: IInsertSession) {
		super();
		const { userId, ...otherParams } = params;
		Object.assign(this, otherParams);
	}

	@Property({ type: t.string, unique: true })
	token!: string;

	@ManyToOne(() => MikroOrmUserModel, { ref: true })
	user!: Ref<MikroOrmUserModel>;

	get userId(): string {
		return this.user.id;
	}

	@Property({ type: t.datetime })
	expiresAt!: Date;

	@Property({ type: t.string, nullable: true })
	ipAddress?: string | null;

	@Property({ type: t.string, nullable: true })
	userAgent?: string | null;
}
