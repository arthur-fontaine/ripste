import * as z from "./utils/zod-db.ts";
import { ApiCredential } from "./ApiCredential.ts";
import { zocker } from "zocker";

const oauth2ClientTable = z.table({
	id: z.string(),
	clientId: z.string(),
	clientSecretHash: z.string(),
	redirectUris: z.array(z.string()),
	scopes: z.array(z.string()),
	...z.timestamps(),
	credential: z.relation.one(
		"credentialId",
		(): z.ZodMiniType<Pick<ApiCredential, "id">> => ApiCredential,
		"id",
	),
});

export const OAuth2Client = oauth2ClientTable.select;
export interface OAuth2Client extends z.infer<typeof OAuth2Client> {
	credential: ApiCredential;
}
export const generateFakeOAuth2Client = zocker(OAuth2Client).generate;

export const OAuth2ClientInsert = oauth2ClientTable.insert;
export interface OAuth2ClientInsert
	extends z.infer<typeof OAuth2ClientInsert> {}
export const generateFakeOAuth2ClientInsert =
	zocker(OAuth2ClientInsert).generate;

export const OAuth2ClientUpdate = oauth2ClientTable.update;
export interface OAuth2ClientUpdate
	extends z.infer<typeof OAuth2ClientUpdate> {}
export const generateFakeOAuth2ClientUpdate =
	zocker(OAuth2ClientUpdate).generate;
