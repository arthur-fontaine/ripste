import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";

export interface ISessionTable extends IBaseModel {
	token: string;
	userId: string;
	expiresAt: Date;
	ipAddress?: string | null;
	userAgent?: string | null;
}

export interface ISession extends ISU.Selectable<ISessionTable> {}
export interface IInsertSession extends ISU.Insertable<ISessionTable> {}
export interface IUpdateSession extends ISU.Updateable<ISessionTable> {}
