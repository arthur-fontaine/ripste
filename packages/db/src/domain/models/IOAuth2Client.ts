import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IApiCredentialTable } from "./IApiCredential.ts";

export interface IOAuth2ClientTable extends IBaseModel {
	clientId: string;
	clientSecretHash: string;
	redirectUris: string[];
	scopes: string[];
	credential: ISU.SingleReference<IApiCredentialTable, "credentialId", "id">;
}

export interface IOAuth2Client extends ISU.Selectable<IOAuth2ClientTable> {}
export interface IInsertOAuth2Client
	extends ISU.Insertable<IOAuth2ClientTable> {}
export interface IUpdateOAuth2Client
	extends ISU.Updateable<IOAuth2ClientTable> {}

export const generateFakeOAuth2Client = createFakeGenerator<IOAuth2Client>(
	"IOAuth2Client",
	__filename,
);

export const generateFakeInsertOAuth2Client =
	createFakeGenerator<IInsertOAuth2Client>("IInsertOAuth2Client", __filename);
