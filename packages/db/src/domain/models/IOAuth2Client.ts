import type { Insertable } from "../../types/insertable.ts";
import type { IApiCredential } from "./IApiCredential.ts";

export interface IOAuth2Client {
	id: string;
	clientId: string;
	clientSecretHash: string;
	redirectUris: string[];
	scopes: string[];

	credential: IApiCredential | null;
}

export type IInsertOAuth2Client = Insertable<IOAuth2Client, "credential">;
