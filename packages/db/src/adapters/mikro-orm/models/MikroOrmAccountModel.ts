import { Entity, Property, t, ManyToOne, type Ref } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type { IInsertAccount } from "../../../domain/models/IAccount.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";

@Entity()
export class MikroOrmAccountModel extends BaseModel {
	constructor(params: IInsertAccount) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	accountId!: string;

	@Property({ type: t.string })
	providerId!: string;

	@ManyToOne(() => MikroOrmUserModel, { ref: true })
	user!: Ref<MikroOrmUserModel>;

	get userId(): string {
		return this.user.id;
	}

	@Property({ type: t.string, nullable: true })
	accessToken?: string | null;

	@Property({ type: t.string, nullable: true })
	refreshToken?: string | null;

	@Property({ type: t.string, nullable: true })
	idToken?: string | null;

	@Property({ type: t.datetime, nullable: true })
	accessTokenExpiresAt?: Date | null;

	@Property({ type: t.datetime, nullable: true })
	refreshTokenExpiresAt?: Date | null;

	@Property({ type: t.string, nullable: true })
	scope?: string | null;
}
