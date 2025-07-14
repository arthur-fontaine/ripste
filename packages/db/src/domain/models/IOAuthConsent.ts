import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";

export interface IOAuthConsentTable extends IBaseModel {
	userId: string;
	clientId: string;
	scopes: string;
	consentGiven: boolean;
}

export interface IOAuthConsent extends ISU.Selectable<IOAuthConsentTable> {}
export interface IInsertOAuthConsent extends ISU.Insertable<IOAuthConsentTable> {}
export interface IUpdateOAuthConsent extends ISU.Updateable<IOAuthConsentTable> {}

export const generateFakeOAuthConsent = createFakeGenerator<IOAuthConsent>(
	"IOAuthConsent",
	__filename,
);

export const generateFakeInsertOAuthConsent = createFakeGenerator<IInsertOAuthConsent>(
	"IInsertOAuthConsent",
	__filename,
);
