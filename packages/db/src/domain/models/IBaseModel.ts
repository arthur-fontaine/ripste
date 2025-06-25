import type { ISU } from "isutypes";

export interface IBaseModel {
	id: ISU.Generated<string>;
	createdAt: ISU.Generated<Date>;
	updatedAt: ISU.Generated<Date | null>;
	deletedAt: ISU.Generated<Date | null>;
}
