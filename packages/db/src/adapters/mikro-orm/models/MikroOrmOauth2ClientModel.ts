import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IOAuth2Client,
	IInsertOAuth2Client,
} from "../../../domain/models/IOAuth2Client.ts";
import { MikroOrmApiCredentialModel } from "./MikroOrmApiCredentialModel.ts";

@Entity()
export class MikroOrmOauth2ClientModel
	extends BaseModel
	implements IOAuth2Client
{
	constructor(params: IInsertOAuth2Client) {
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

	@ManyToOne(() => MikroOrmApiCredentialModel)
	credential!: MikroOrmApiCredentialModel;

	get credentialId(): string {
		return this.credential.id;
	}
}
