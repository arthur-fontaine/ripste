import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { IStoreTable } from "./IStore.ts";
import type { IThemeCustomizationTable } from "./IThemeCustomization.ts";
import type { ICheckoutPageTable } from "./ICheckoutPage.ts";

export interface ICheckoutThemeTable extends IBaseModel {
	name: string;
	version: number;
	store: ISU.SingleReference<IStoreTable, 'storeId', 'id'>;
	customizations: ISU.ManyReference<IThemeCustomizationTable>;
	checkoutPages: ISU.ManyReference<ICheckoutPageTable>;
}

export interface ICheckoutTheme extends ISU.Selectable<ICheckoutThemeTable> {}
export interface IInsertCheckoutTheme extends ISU.Insertable<ICheckoutThemeTable> {}
export interface IUpdateCheckoutTheme extends ISU.Updateable<ICheckoutThemeTable> {}

export const generateFakeCheckoutTheme = createFakeGenerator<ICheckoutTheme>('ICheckoutTheme', __filename);
export const generateFakeInsertCheckoutTheme = createFakeGenerator<IInsertCheckoutTheme>(
	"IInsertCheckoutTheme",
	__filename
);
