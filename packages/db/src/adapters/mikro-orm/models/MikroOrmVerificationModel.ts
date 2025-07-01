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

	@Property({ type: t.string })
	value!: string;

	@Property({ type: t.datetime })
	expiresAt!: Date;

	@Property({ type: t.enum })
	type!: "email" | "phone" | "otp" | "password-reset";
}
