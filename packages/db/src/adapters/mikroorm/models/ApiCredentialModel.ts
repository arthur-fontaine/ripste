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
import { BaseModel } from "./BaseModel.ts";
import type { IApiCredential } from "../../../domain/models/IApiCredential.ts";
import { StoreModel } from "./StoreModel.ts";
import { UserModel } from "./UserModel.ts";
import { JwtTokenModel } from "./JwtTokenModel.ts";
import { Oauth2ClientModel } from "./Oauth2ClientModel.ts";
import { TransactionModel } from "./TransactionModel.ts";

const CredentialType = {
	JWT: "jwt",
	OAUTH2: "oauth2",
} as const;

@Entity()
export class ApiCredentialModel extends BaseModel implements IApiCredential {
	@ManyToOne(() => StoreModel, { nullable: true })
	store: StoreModel | null;

	@Property({ type: t.string })
	name: string;

	@Enum(() => CredentialType)
	credentialType: "jwt" | "oauth2";

	@Property({ type: t.boolean, default: true })
	isActive: boolean;

	@ManyToOne(() => UserModel)
	createdByUser: UserModel;

	@Property({ type: t.datetime, nullable: true })
	expiresAt: Date | null;

	@Property({ type: t.datetime, nullable: true })
	lastUsedAt: Date | null;

	@OneToOne(
		() => JwtTokenModel,
		(token) => token.credential,
		{
			nullable: true,
		},
	)
	jwtToken: JwtTokenModel | null = null;

	get jwtTokenId(): string | null {
		return this.jwtToken ? this.jwtToken.id : null;
	}

	@OneToOne(
		() => Oauth2ClientModel,
		(client) => client.credential,
		{
			nullable: true,
		},
	)
	oauth2Client: Oauth2ClientModel | null = null;

	get oauth2ClientId(): string | null {
		return this.oauth2Client ? this.oauth2Client.id : null;
	}

	@OneToMany(
		() => TransactionModel,
		(transaction) => transaction.apiCredential,
	)
	private _transactions = new Collection<TransactionModel>(this);

	get transactions(): TransactionModel[] {
		return this._transactions.getItems();
	}

	get createdBy(): string {
		return this.createdByUser.id;
	}

	get storeId(): string | null {
		return this.store ? this.store.id : null;
	}

	get createdByUserId(): string {
		return this.createdByUser.id;
	}

	constructor({
		store,
		name,
		credentialType,
		createdByUser,
		isActive = true,
		expiresAt = null,
		lastUsedAt = null,
	}: Pick<
		ApiCredentialModel,
		"store" | "name" | "credentialType" | "createdByUser"
	> &
		Partial<
			Pick<ApiCredentialModel, "isActive" | "expiresAt" | "lastUsedAt">
		>) {
		super();
		this.store = store;
		this.name = name;
		this.credentialType = credentialType;
		this.createdByUser = createdByUser;
		this.isActive = isActive;
		this.expiresAt = expiresAt;
		this.lastUsedAt = lastUsedAt;
	}
}
