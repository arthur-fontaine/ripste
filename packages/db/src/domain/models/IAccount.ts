import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";

export interface IAccountTable extends IBaseModel {
	userId: string;
	accountId: string;
	providerId: string;
	accessToken?: string | null;
	refreshToken?: string | null;
	idToken?: string | null;
	accessTokenExpiresAt?: Date | null;
	refreshTokenExpiresAt?: Date | null;
	scope?: string | null;
}

export interface IAccount extends ISU.Selectable<IAccountTable> {}
export interface IInsertAccount extends ISU.Insertable<IAccountTable> {}
export interface IUpdateAccount extends ISU.Updateable<IAccountTable> {}
