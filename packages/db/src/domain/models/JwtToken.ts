import * as z from "./utils/zod-db.ts";
import { ApiCredential } from "./ApiCredential.ts";
import { zocker } from "zocker";

const jwtTokenTable = z.table({
	id: z.string(),
	tokenHash: z.string(),
	permissions: z.array(z.string()),
	...z.timestamps(),
	credential: z.relation.one(
		"credentialId",
		(): z.ZodMiniType<Pick<ApiCredential, "id">> => ApiCredential,
		"id",
	),
});

export const JwtToken = jwtTokenTable.select;
export interface JwtToken extends z.infer<typeof JwtToken> {
	credential: ApiCredential;
}
export const generateFakeJwtToken = zocker(JwtToken).generate;

export const JwtTokenInsert = jwtTokenTable.insert;
export interface JwtTokenInsert extends z.infer<typeof JwtTokenInsert> {}
export const generateFakeJwtTokenInsert = zocker(JwtTokenInsert).generate;

export const JwtTokenUpdate = jwtTokenTable.update;
export interface JwtTokenUpdate extends z.infer<typeof JwtTokenUpdate> {}
export const generateFakeJwtTokenUpdate = zocker(JwtTokenUpdate).generate;
