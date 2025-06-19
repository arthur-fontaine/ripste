import {
	Entity,
	Property,
	t,
	Enum,
	ManyToOne,
	OneToOne,
	OneToMany,
	Collection,
} from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IApiCredential,
	IApiCredentialInsert,
} from "../../../domain/models/ApiCredential.ts";
import { MikroOrmStoreModel } from "./MikroOrmStoreModel.ts";
import { MikroOrmUserModel } from "./MikroOrmUserModel.ts";
import { MikroOrmJwtTokenModel } from "./MikroOrmJwtTokenModel.ts";
import { MikroOrmOauth2ClientModel } from "./MikroOrmOauth2ClientModel.ts";
import { MikroOrmTransactionModel } from "./MikroOrmTransactionModel.ts";

const CredentialType = {
	JWT: "jwt",
	OAUTH2: "oauth2",
} as const;

@Entity()
export class ApiCredentialModel extends BaseModel implements IApiCredential {
	constructor(params: IApiCredentialInsert) {
		super();
		Object.assign(this, params);
	}

	@ManyToOne(() => MikroOrmStoreModel)
	store!: MikroOrmStoreModel;

	@Property({ type: t.string })
	name!: string;

	@Enum(() => CredentialType)
	credentialType!: "jwt" | "oauth2";

	@Property({ type: t.boolean, default: true })
	isActive!: boolean;

	@ManyToOne(() => MikroOrmUserModel)
	createdByUser!: MikroOrmUserModel;

	@Property({ type: t.datetime, nullable: true })
	expiresAt!: Date | null;

	@Property({ type: t.datetime, nullable: true })
	lastUsedAt!: Date | null;

	@OneToOne(
		() => MikroOrmJwtTokenModel,
		(token) => token.credential,
		{
			nullable: true,
		},
	)
	jwtToken: MikroOrmJwtTokenModel | null = null;

	@OneToOne(
		() => MikroOrmOauth2ClientModel,
		(client) => client.credential,
		{
			nullable: true,
		},
	)
	oauth2Client: MikroOrmOauth2ClientModel | null = null;

	@OneToMany(
		() => MikroOrmTransactionModel,
		(transaction) => transaction.apiCredential,
	)
	private _transactions = new Collection<MikroOrmTransactionModel>(this);
	get transactions(): MikroOrmTransactionModel[] {
		return this._transactions.getItems();
	}
}
