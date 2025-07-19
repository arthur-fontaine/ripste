import { Entity, Property, t } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IOAuthApplication,
	IInsertOAuthApplication,
} from "../../../domain/models/IOAuthApplication.ts";

@Entity()
export class MikroOrmOAuthApplicationModel
	extends BaseModel
	implements IOAuthApplication
{
	constructor(params: IInsertOAuthApplication) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string, unique: true })
	clientId!: string;

	@Property({ type: t.string })
	clientSecret!: string;

	@Property({ type: t.string })
	name!: string;

	@Property({ type: t.text })
	redirectURLs!: string;

	@Property({ type: t.text, nullable: true })
	metadata?: string | null;

	@Property({ type: t.string })
	type!: string;

	@Property({ type: t.boolean, default: false })
	disabled!: boolean;

	@Property({ type: t.string, nullable: true })
	userId?: string | null;
}
