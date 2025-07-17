import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import type { IJwtToken } from "./IJwtToken.ts";
import type { IStore } from "./IStore.ts";
import type { ITransaction } from "./ITransaction.ts";
import type { IUser } from "./IUser.ts";
import { createFakeGenerator } from "interface-faker";

export interface IApiCredentialTable extends IBaseModel {
	name: string;
	credentialType: "jwt" | "oauth2";
	isActive: boolean;
	expiresAt: Date | null;
	lastUsedAt: Date | null;

	store: ISU.SingleReference<IStore | null, "storeId", "id">;
	createdByUser: ISU.SingleReference<IUser | null, "createdByUserId", "id">;
	jwtToken: ISU.SingleReference<IJwtToken | null, "jwtTokenId", "id">;

	transactions: ISU.ManyReference<ITransaction>;
}

export interface IApiCredential extends ISU.Selectable<IApiCredentialTable> {}
export interface IInsertApiCredential
	extends ISU.Insertable<IApiCredentialTable> {}
export interface IUpdateApiCredential
	extends ISU.Updateable<IApiCredentialTable> {}

export const generateFakeApiCredential = createFakeGenerator<IApiCredential>(
	"IApiCredential",
	__filename,
);
export const generateFakeInsertApiCredential =
	createFakeGenerator<IInsertApiCredential>("IInsertApiCredential", __filename);
