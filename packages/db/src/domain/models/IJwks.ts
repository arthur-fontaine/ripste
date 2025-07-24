import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";

export interface IJwksTable extends IBaseModel {
	publicKey: string;
	privateKey: string;
}

export interface IJwks extends ISU.Selectable<IJwksTable> {}
export interface IInsertJwks extends ISU.Insertable<IJwksTable> {}
export interface IUpdateJwks extends ISU.Updateable<IJwksTable> {}
