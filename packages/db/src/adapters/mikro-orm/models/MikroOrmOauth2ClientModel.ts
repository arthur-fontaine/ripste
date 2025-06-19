import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IOAuth2Client,
	IOAuth2ClientInsert,
} from "../../../domain/models/OAuth2Client.ts";
import { ApiCredentialModel } from "./MikroOrmApiCredential.ts";

@Entity()
export class MikroOrmOauth2ClientModel
	extends BaseModel
	implements IOAuth2Client
{
	constructor(params: IOAuth2ClientInsert) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	clientId!: string;

	@Property({ type: t.string })
	clientSecretHash!: string;

	@Property({ type: t.array })
	redirectUris!: string[];

	@Property({ type: t.array })
	scopes!: string[];

	@ManyToOne(() => ApiCredentialModel)
	credential!: ApiCredentialModel;
}
