import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";

export interface IVerificationTable extends IBaseModel {
	identifier: string;
	value: string;
	expiresAt: Date;
}

export interface IVerification extends ISU.Selectable<IVerificationTable> {}
export interface IInsertVerification
	extends ISU.Insertable<IVerificationTable> {}
export interface IUpdateVerification
	extends ISU.Updateable<IVerificationTable> {}
