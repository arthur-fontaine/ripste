import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IJwtToken,
	IJwtTokenInsert,
} from "../../../domain/models/JwtToken.ts";
import { MikroOrmApiCredentialModel } from "./MikroOrmApiCredential.ts";

@Entity()
export class MikroOrmJwtTokenModel extends BaseModel implements IJwtToken {
	constructor(params: IJwtTokenInsert) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	tokenHash!: string;

	@Property({ type: t.array })
	permissions!: string[];

	@ManyToOne(() => MikroOrmApiCredentialModel)
	credential!: MikroOrmApiCredentialModel;
}
