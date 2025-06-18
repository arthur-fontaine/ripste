import * as z from "./utils/zod-db.ts";
import { Store } from "./Store.ts";
import { User } from "./User.ts";
import { JwtToken } from "./JwtToken.ts";
import { OAuth2Client } from "./OAuth2Client.ts";
import { Transaction } from "./Transaction.ts";
import { zocker } from "zocker";

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
		(): z.ZodMiniNullable<z.ZodMiniType<Pick<Store, "id">>> =>
			z.nullable(Store),
		"id",
	),
	createdByUser: z.relation.one(
		"createdByUserId",
		(): z.ZodMiniNullable<z.ZodMiniType<Pick<User, "id">>> => z.nullable(User),
		"id",
	),
	jwtToken: z.relation.one("jwtTokenId", () => z.nullable(JwtToken), "id"),
	oauth2Client: z.relation.one(
		"oauth2ClientId",
		() => z.nullable(OAuth2Client),
		"id",
	),
	transactions: z.relation.many(
		(): z.ZodMiniType<Pick<Transaction, "id">> => Transaction,
	),
});

export const ApiCredential = apiCredentialTable.select;
export interface ApiCredential extends z.infer<typeof ApiCredential> {
	store: Store | null;
	createdByUser: User | null;
	transactions: Transaction[];
}
export const generateFakeApiCredential = zocker(ApiCredential).generate;

export const ApiCredentialInsert = apiCredentialTable.insert;
export interface ApiCredentialInsert
	extends z.infer<typeof ApiCredentialInsert> {}
export const generateFakeApiCredentialInsert =
	zocker(ApiCredentialInsert).generate;

export const ApiCredentialUpdate = apiCredentialTable.update;
export interface ApiCredentialUpdate
	extends z.infer<typeof ApiCredentialUpdate> {}
export const generateFakeApiCredentialUpdate =
	zocker(ApiCredentialUpdate).generate;
