import { Entity, Property, ManyToOne, type Rel, t } from "@mikro-orm/core";
import { BaseModel } from "./BaseModel.ts";
import { ApiCredentialModel } from "./ApiCredentialModel.ts";
import type { IOAuth2Client } from "../../../domain/models/IOAuth2Client.ts";

@Entity()
export class Oauth2ClientModel extends BaseModel implements IOAuth2Client {
	@Property({ type: t.string, unique: true })
	clientId: string;

	@Property({ type: t.string })
	clientSecretHash: string;

	@Property({ type: t.json })
	redirectUris: string[];

	@Property({ type: t.json })
	scopes: string[];

	@ManyToOne(() => ApiCredentialModel)
	credential: Rel<ApiCredentialModel>;

	constructor({
		clientId,
		clientSecretHash,
		redirectUris,
		scopes,
		credential,
	}: Pick<
		Oauth2ClientModel,
		"clientId" | "clientSecretHash" | "redirectUris" | "scopes" | "credential"
	>) {
		super();
		this.clientId = clientId;
		this.clientSecretHash = clientSecretHash;
		this.redirectUris = redirectUris;
		this.scopes = scopes;
		this.credential = credential;
	}
}
