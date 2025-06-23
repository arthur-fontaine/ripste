import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IApiCredentialTable } from "./IApiCredential.ts";

export interface IJwtTokenTable extends IBaseModel {
	tokenHash: string;
	permissions: string[];
	credential: ISU.SingleReference<IApiCredentialTable, "credentialId", "id">;
}

export interface IJwtToken extends ISU.Selectable<IJwtTokenTable> {}
export interface IInsertJwtToken extends ISU.Insertable<IJwtTokenTable> {}
export interface IUpdateJwtToken extends ISU.Updateable<IJwtTokenTable> {}

export const generateFakeJwtToken = createFakeGenerator<IJwtToken>(
	"IJwtToken",
	__filename,
);

export const generateFakeInsertJwtToken = createFakeGenerator<IInsertJwtToken>(
	"IInsertJwtToken",
	__filename,
);
