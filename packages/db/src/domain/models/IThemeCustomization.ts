import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { ICheckoutThemeTable } from "./ICheckoutTheme.ts";

export interface IThemeCustomizationTable extends IBaseModel {
	customizationType: "css";
	content: string | null;
	theme: ISU.SingleReference<ICheckoutThemeTable, "themeId", "id">;
}

export interface IThemeCustomization
	extends ISU.Selectable<IThemeCustomizationTable> {}
export interface IInsertThemeCustomization
	extends ISU.Insertable<IThemeCustomizationTable> {}
export interface IUpdateThemeCustomization
	extends ISU.Updateable<IThemeCustomizationTable> {}

export const generateFakeThemeCustomization =
	createFakeGenerator<IThemeCustomization>("IThemeCustomization", __filename);

export const generateFakeInsertThemeCustomization =
	createFakeGenerator<IInsertThemeCustomization>(
		"IInsertThemeCustomization",
		__filename,
	);
