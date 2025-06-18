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
	deletedAt: Date | null;

	store: IStore;
	customizations: IThemeCustomization[];
	checkoutPages: ICheckoutPage[];
}

export type IInsertCheckoutTheme = Insertable<
	ICheckoutTheme,
	"store" | "customizations" | "checkoutPages"
> & {
	storeId: IStore["id"];
	customizations?: IThemeCustomization[] | null;
};
