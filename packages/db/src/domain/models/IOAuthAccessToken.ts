import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";

export interface IOAuthAccessTokenTable extends IBaseModel {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
	refreshTokenExpiresAt: Date;
	clientId: string;
	userId: string;
	scopes: string;
}

export interface IOAuthAccessToken
	extends ISU.Selectable<IOAuthAccessTokenTable> {}
export interface IInsertOAuthAccessToken
	extends ISU.Insertable<IOAuthAccessTokenTable> {}
export interface IUpdateOAuthAccessToken
	extends ISU.Updateable<IOAuthAccessTokenTable> {}

export const generateFakeOAuthAccessToken =
	createFakeGenerator<IOAuthAccessToken>("IOAuthAccessToken", __filename);

export const generateFakeInsertOAuthAccessToken =
	createFakeGenerator<IInsertOAuthAccessToken>(
		"IInsertOAuthAccessToken",
		__filename,
	);
