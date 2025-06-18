import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./BaseModel.ts";
import { ApiCredentialModel } from "./ApiCredentialModel.ts";
import type { IJwtToken } from "../../../domain/models/IJwtToken.ts";

@Entity()
export class JwtTokenModel extends BaseModel implements IJwtToken {
	@Property({ unique: true })
	tokenHash: string;

	@Property({ type: "json" })
	permissions: string[];

	@ManyToOne(() => ApiCredentialModel)
	credential: ApiCredentialModel;

	constructor({
		tokenHash,
		permissions,
		credential,
	}: Pick<JwtTokenModel, "tokenHash" | "permissions" | "credential">) {
		super();
		this.tokenHash = tokenHash;
		this.permissions = permissions;
		this.credential = credential;
	}
}
