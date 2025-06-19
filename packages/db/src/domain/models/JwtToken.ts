import * as z from "./utils/zod-db.ts";
import { ApiCredential, type IApiCredential } from "./ApiCredential.ts";
import { zocker } from "zocker";

const jwtTokenTable = z.table({
	id: z.generated(z.string()),
	tokenHash: z.string(),
	permissions: z.array(z.string()),
	...z.timestamps(),
	credential: z.relation.one(
		"credentialId",
		(): z.ZodMiniType<Pick<IApiCredential, "id">> => ApiCredential,
		"id",
	),
});

export const JwtToken = jwtTokenTable.select;
export interface IJwtToken extends z.infer<typeof JwtToken> {
	credential: IApiCredential;
}
export const generateFakeJwtToken = () => zocker(JwtToken).generate();

export const JwtTokenInsert = jwtTokenTable.insert;
export interface IJwtTokenInsert extends z.infer<typeof JwtTokenInsert> {}
export const generateFakeJwtTokenInsert = () =>
	zocker(JwtTokenInsert).generate();

export const JwtTokenUpdate = jwtTokenTable.update;
export interface IJwtTokenUpdate extends z.infer<typeof JwtTokenUpdate> {}
export const generateFakeJwtTokenUpdate = () =>
	zocker(JwtTokenUpdate).generate();
