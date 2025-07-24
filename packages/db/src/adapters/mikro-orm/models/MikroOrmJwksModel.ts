import { Entity, Property, t } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type { IInsertJwks, IJwks } from "../../../domain/models/IJwks.ts";

@Entity()
export class MikroOrmJwksModel extends BaseModel implements IJwks {
	constructor(params: IInsertJwks) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.text, unique: true })
	publicKey!: string;

	@Property({ type: t.text, unique: true })
	privateKey!: string;
}
