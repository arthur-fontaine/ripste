import type {
	IApiCredential,
	IInsertApiCredential,
} from "../models/IApiCredential.ts";

export interface IApiCredentialRepository {
	findById(id: string): Promise<IApiCredential | null>;
	findMany(params: {
		storeId?: string;
		userId?: string;
		credentialType?: "jwt" | "oauth2";
		active?: boolean;
		expired?: boolean;
	}): Promise<IApiCredential[]>;
	updateLastUsedAt(id: string): Promise<void>;
	deactivateCredential(id: string): Promise<IApiCredential>;
	create(credentialData: IInsertApiCredential): Promise<IApiCredential>;
	update(
		id: string,
		credentialData: IInsertApiCredential,
	): Promise<IApiCredential>;
	delete(id: string): Promise<void>;
}
