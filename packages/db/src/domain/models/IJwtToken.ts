import type { Insertable } from "../../types/insertable.ts";
import type { IApiCredential } from "./IApiCredential.ts";

export interface IJwtToken {
	id: string;
	tokenHash: string;
	permissions: string[];
	deletedAt: Date | null;

	credential: IApiCredential;
}

export type IInsertJwtToken = Insertable<IJwtToken, "credential"> & {
	credentialId: IApiCredential["id"];
};
