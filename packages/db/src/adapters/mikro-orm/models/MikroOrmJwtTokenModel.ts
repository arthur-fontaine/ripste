import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IJwtToken,
	IInsertJwtToken,
} from "../../../domain/models/IJwtToken.ts";
import { MikroOrmApiCredentialModel } from "./MikroOrmApiCredentialModel.ts";

@Entity()
export class MikroOrmJwtTokenModel extends BaseModel implements IJwtToken {
	constructor(params: IInsertJwtToken) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	tokenHash!: string;

	@Property({ type: t.array })
	permissions!: string[];

	@ManyToOne(() => MikroOrmApiCredentialModel)
	credential!: MikroOrmApiCredentialModel;

	get credentialId(): string {
		return this.credential.id;
	}
}
