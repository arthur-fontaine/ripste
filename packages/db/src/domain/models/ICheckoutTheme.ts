import type { Insertable } from "../../types/insertable.ts";
import type { ICheckoutPage } from "./ICheckoutPage.ts";
import type { IStore } from "./IStore.ts";
import type { IThemeCustomization } from "./IThemeCustomization.ts";

export interface ICheckoutTheme {
	id: string;
	name: string;
	version: number;
	createdAt: Date;
	updatedAt: Date | null;

	store: IStore | null;
	customizations: IThemeCustomization[] | null;
	checkoutPages: ICheckoutPage[] | null;
}

export type IInsertCheckoutTheme = Insertable<
	ICheckoutTheme,
	"store" | "customizations" | "checkoutPages"
> & {
	storeId: IStore["id"] | null;
	customizations: IThemeCustomization[] | null;
};
