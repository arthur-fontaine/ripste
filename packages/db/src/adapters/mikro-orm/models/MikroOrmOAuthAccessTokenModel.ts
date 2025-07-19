import { Entity, Property, t } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IOAuthAccessToken,
	IInsertOAuthAccessToken,
} from "../../../domain/models/IOAuthAccessToken.ts";

@Entity()
export class MikroOrmOAuthAccessTokenModel
	extends BaseModel
	implements IOAuthAccessToken
{
	constructor(params: IInsertOAuthAccessToken) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.text, unique: true })
	accessToken!: string;

	@Property({ type: t.text, unique: true })
	refreshToken!: string;

	@Property({ type: t.datetime })
	accessTokenExpiresAt!: Date;

	@Property({ type: t.datetime })
	refreshTokenExpiresAt!: Date;

	@Property({ type: t.string })
	clientId!: string;

	@Property({ type: t.string })
	userId!: string;

	@Property({ type: t.text })
	scopes!: string;
}
