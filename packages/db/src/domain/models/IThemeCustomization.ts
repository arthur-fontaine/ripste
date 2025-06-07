import type { Insertable } from "../../types/insertable.ts";
import type { ICheckoutTheme } from "./ICheckoutTheme.ts";

export interface IThemeCustomization {
	id: string;
	customizationType: "css";
	content: string | null;
	createdAt: Date;
	updatedAt: Date | null;

	theme: ICheckoutTheme | null;
}

export type IInsertThemeCustomization = Insertable<
	IThemeCustomization,
	"theme"
>;
