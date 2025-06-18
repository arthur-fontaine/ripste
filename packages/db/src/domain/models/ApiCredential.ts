import * as z from "./utils/zod-db.ts";
import { type IStore, Store } from "./Store.ts";
import { User, type IUser } from "./User.ts";
import { type ITransaction, Transaction } from "./Transaction.ts";
import { zocker } from "zocker";
import { JwtToken } from "./JwtToken.ts";
import { OAuth2Client } from "./OAuth2Client.ts";

const apiCredentialTable = z.table({
	id: z.string(),
	name: z.string(),
	credentialType: z.enum(["jwt", "oauth2"]),
	isActive: z.boolean(),
	createdBy: z.string(),
	expiresAt: z.nullable(z.iso.datetime()),
	lastUsedAt: z.nullable(z.iso.datetime()),
	...z.timestamps(),
	store: z.relation.one(
		"storeId",
		(): z.ZodMiniNullable<z.ZodMiniType<Pick<IStore, "id">>> =>
			z.nullable(Store),
		"id",
	),
	createdByUser: z.relation.one(
		"createdByUserId",
		(): z.ZodMiniNullable<z.ZodMiniType<Pick<IUser, "id">>> => z.nullable(User),
		"id",
	),
	jwtToken: z.relation.one("jwtTokenId", () => z.nullable(JwtToken), "id"),
	oauth2Client: z.relation.one(
		"oauth2ClientId",
		() => z.nullable(OAuth2Client),
		"id",
	),
	transactions: z.relation.many(
		(): z.ZodMiniType<Pick<ITransaction, "id">> => Transaction,
	),
});

export const ApiCredential = apiCredentialTable.select;
export interface IApiCredential extends z.infer<typeof ApiCredential> {
	store: IStore | null;
	createdByUser: IUser | null;
	transactions: ITransaction[];
}
export const generateFakeApiCredential = zocker(ApiCredential).generate;

export const ApiCredentialInsert = apiCredentialTable.insert;
export interface IApiCredentialInsert
	extends z.infer<typeof ApiCredentialInsert> {}
export const generateFakeApiCredentialInsert =
	zocker(ApiCredentialInsert).generate;

export const ApiCredentialUpdate = apiCredentialTable.update;
export interface IApiCredentialUpdate
	extends z.infer<typeof ApiCredentialUpdate> {}
export const generateFakeApiCredentialUpdate =
	zocker(ApiCredentialUpdate).generate;
