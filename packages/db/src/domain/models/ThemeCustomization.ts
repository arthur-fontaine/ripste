import * as z from "./utils/zod-db.ts";
import { CheckoutTheme } from "./CheckoutTheme.ts";
import { zocker } from "zocker";

const themeCustomizationTable = z.table({
	id: z.generated(z.string()),
	customizationType: z.enum(["css"]),
	content: z.nullable(z.string()),
	...z.timestamps(),
	theme: z.relation.one("themeId", () => CheckoutTheme, "id"),
});

export const ThemeCustomization = themeCustomizationTable.select;
export interface IThemeCustomization
	extends z.infer<typeof ThemeCustomization> {}
export const generateFakeThemeCustomization = () =>
	zocker(ThemeCustomization).generate();

export const ThemeCustomizationInsert = themeCustomizationTable.insert;
export interface IThemeCustomizationInsert
	extends z.infer<typeof ThemeCustomizationInsert> {}
export const generateFakeThemeCustomizationInsert = () =>
	zocker(ThemeCustomizationInsert).generate();

export const ThemeCustomizationUpdate = themeCustomizationTable.update;
export interface IThemeCustomizationUpdate
	extends z.infer<typeof ThemeCustomizationUpdate> {}
export const generateFakeThemeCustomizationUpdate = () =>
	zocker(ThemeCustomizationUpdate).generate();
