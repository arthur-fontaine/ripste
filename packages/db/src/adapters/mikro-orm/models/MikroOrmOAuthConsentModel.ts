import { Entity, Property, t } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IOAuthConsent,
	IInsertOAuthConsent,
} from "../../../domain/models/IOAuthConsent.ts";

@Entity()
export class MikroOrmOAuthConsentModel
	extends BaseModel
	implements IOAuthConsent
{
	constructor(params: IInsertOAuthConsent) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	userId!: string;

	@Property({ type: t.string })
	clientId!: string;

	@Property({ type: t.text })
	scopes!: string;

	@Property({ type: t.boolean })
	consentGiven!: boolean;
}
