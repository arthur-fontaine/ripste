import { Entity, Property, t } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type { IInsertVerification } from "../../../domain/models/IVerification.ts";

@Entity()
export class MikroOrmVerificationModel extends BaseModel {
	constructor(params: IInsertVerification) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	identifier!: string;

	@Property({ type: t.text })
	value!: string;

	@Property({ type: t.datetime })
	expiresAt!: Date;
}
