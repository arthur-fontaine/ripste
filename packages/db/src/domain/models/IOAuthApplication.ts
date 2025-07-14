import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";

export interface IOAuthApplicationTable extends IBaseModel {
	clientId: string;
	clientSecret: string;
	name: string;
	redirectURLs: string;
	metadata?: string | null;
	type: string;
	disabled: boolean;
	userId?: string | null;
}

export interface IOAuthApplication extends ISU.Selectable<IOAuthApplicationTable> {}
export interface IInsertOAuthApplication extends ISU.Insertable<IOAuthApplicationTable> {}
export interface IUpdateOAuthApplication extends ISU.Updateable<IOAuthApplicationTable> {}

export const generateFakeOAuthApplication = createFakeGenerator<IOAuthApplication>(
	"IOAuthApplication",
	__filename,
);

export const generateFakeInsertOAuthApplication = createFakeGenerator<IInsertOAuthApplication>(
	"IInsertOAuthApplication",
	__filename,
);
