import {
	Entity,
	Property,
	t,
	Enum,
	ManyToOne,
	OneToMany,
	Collection,
} from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IApiCredential,
	IInsertApiCredential,
} from "../../../domain/models/IApiCredential.ts";
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
export class MikroOrmApiCredentialModel
	extends BaseModel
	implements IApiCredential
{
	constructor(params: IInsertApiCredential) {
		super();
		Object.assign(this, params);
	}

	@ManyToOne(() => MikroOrmStoreModel, { nullable: true })
	store: MikroOrmStoreModel | null = null;

	get storeId(): string | null {
		return this.store ? this.store.id : null;
	}

	@Property({ type: t.string })
	name!: string;

	@Enum(() => CredentialType)
	credentialType!: "jwt" | "oauth2";

	@Property({ type: t.boolean, default: true })
	isActive!: boolean;

	@ManyToOne(() => MikroOrmUserModel, { nullable: true })
	createdByUser: MikroOrmUserModel | null = null;

	get createdByUserId(): string | null {
		return this.createdByUser ? this.createdByUser.id : null;
	}

	@Property({ type: t.datetime, nullable: true })
	expiresAt!: Date | null;

	@Property({ type: t.datetime, nullable: true })
	lastUsedAt!: Date | null;

	@OneToMany(
		() => MikroOrmJwtTokenModel,
		(token) => token.credential,
		{
			nullable: true,
		},
	)
	jwtToken: MikroOrmJwtTokenModel | null = null;

	get jwtTokenId(): string | null {
		return this.jwtToken ? this.jwtToken.id : null;
	}

	@OneToMany(
		() => MikroOrmOauth2ClientModel,
		(client) => client.credential,
		{
			nullable: true,
		},
	)
	oauth2Client: MikroOrmOauth2ClientModel | null = null;

	get oauth2ClientId(): string | null {
		return this.oauth2Client ? this.oauth2Client.id : null;
	}

	@OneToMany(
		() => MikroOrmTransactionModel,
		(transaction) => transaction.apiCredential,
	)
	private _transactions = new Collection<MikroOrmTransactionModel>(this);
	get transactions(): MikroOrmTransactionModel[] {
		return this._transactions.getItems();
	}
}
