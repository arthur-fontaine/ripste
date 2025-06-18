import type { IInsertJwtToken, IJwtToken } from "../models/IJwtToken.ts";

export interface IJwtTokenRepository {
	findById(id: string): Promise<IJwtToken | null>;
	findMany(params: {
		credentialId?: string;
		tokenHash?: string;
	}): Promise<IJwtToken[]>;
	create(tokenData: IInsertJwtToken): Promise<IJwtToken>;
	update(id: string, tokenData: IInsertJwtToken): Promise<IJwtToken>;
	delete(id: string): Promise<void>;
	deleteByCredentialId(credentialId: string): Promise<void>;
}
