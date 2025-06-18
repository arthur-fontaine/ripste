import * as z from "./utils/zod-db.ts";
import { Store, type IStore } from "./Store.ts";
import { CheckoutPage, type ICheckoutPage } from "./CheckoutPage.ts";
import { type IThemeCustomization, ThemeCustomization } from "./ThemeCustomization.ts";
import { zocker } from "zocker";

const checkoutThemeTable = z.table({
	id: z.string(),
	name: z.string(),
	version: z.number(),
	...z.timestamps(),
	store: z.relation.one(
		"storeId",
		(): z.ZodMiniType<Pick<IStore, "id">> => Store,
		"id",
	),
	customizations: z.relation.many(
		(): z.ZodMiniType<Pick<IThemeCustomization, "id">> => ThemeCustomization,
	),
	checkoutPages: z.relation.many(
		(): z.ZodMiniType<Pick<ICheckoutPage, "id">> => CheckoutPage,
	),
});

export const CheckoutTheme = checkoutThemeTable.select;
export interface ICheckoutTheme extends z.infer<typeof CheckoutTheme> {
	store: IStore;
	customizations: IThemeCustomization[];
	checkoutPages: ICheckoutPage[];
}
export const generateFakeCheckoutTheme = zocker(CheckoutTheme).generate;

export const CheckoutThemeInsert = checkoutThemeTable.insert;
export interface ICheckoutThemeInsert
	extends z.infer<typeof CheckoutThemeInsert> {}
export const generateFakeCheckoutThemeInsert =
	zocker(CheckoutThemeInsert).generate;

export const CheckoutThemeUpdate = checkoutThemeTable.update;
export interface ICheckoutThemeUpdate
	extends z.infer<typeof CheckoutThemeUpdate> {}
export const generateFakeCheckoutThemeUpdate =
	zocker(CheckoutThemeUpdate).generate;
