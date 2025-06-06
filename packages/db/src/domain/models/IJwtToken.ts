import type { Insertable } from "../../types/insertable.ts";
import type { IApiCredential } from "./IApiCredential.ts";

export interface IJwtToken {
	id: string;
	tokenHash: string;
	permissions: string[];

	credential: IApiCredential | null;
}

export type IInsertJwtToken = Insertable<IJwtToken, "credential">;
