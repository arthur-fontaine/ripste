import * as z from "./utils/zod-db.ts";
import { Store } from "./Store.ts";
import { CheckoutPage } from "./CheckoutPage.ts";
import { ThemeCustomization } from "./ThemeCustomization.ts";
import { zocker } from "zocker";

const checkoutThemeTable = z.table({
	id: z.string(),
	name: z.string(),
	version: z.number(),
	...z.timestamps(),
	store: z.relation.one(
		"storeId",
		(): z.ZodMiniType<Pick<Store, "id">> => Store,
		"id",
	),
	customizations: z.relation.many(
		(): z.ZodMiniType<Pick<ThemeCustomization, "id">> => ThemeCustomization,
	),
	checkoutPages: z.relation.many(
		(): z.ZodMiniType<Pick<CheckoutPage, "id">> => CheckoutPage,
	),
});

export const CheckoutTheme = checkoutThemeTable.select;
export interface CheckoutTheme extends z.infer<typeof CheckoutTheme> {
	store: Store;
	customizations: ThemeCustomization[];
	checkoutPages: CheckoutPage[];
}
export const generateFakeCheckoutTheme = zocker(CheckoutTheme).generate;

export const CheckoutThemeInsert = checkoutThemeTable.insert;
export interface CheckoutThemeInsert
	extends z.infer<typeof CheckoutThemeInsert> {}
export const generateFakeCheckoutThemeInsert =
	zocker(CheckoutThemeInsert).generate;

export const CheckoutThemeUpdate = checkoutThemeTable.update;
export interface CheckoutThemeUpdate
	extends z.infer<typeof CheckoutThemeUpdate> {}
export const generateFakeCheckoutThemeUpdate =
	zocker(CheckoutThemeUpdate).generate;
