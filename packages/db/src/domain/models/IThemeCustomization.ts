import type { Insertable } from "../../types/insertable.ts";
import type { ICheckoutTheme } from "./ICheckoutTheme.ts";

export interface IThemeCustomization {
	id: string;
	customizationType: "css";
	content: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;

	theme: ICheckoutTheme;
}

export type IInsertThemeCustomization = Insertable<
	IThemeCustomization,
	"theme"
> & {
	themeId: ICheckoutTheme["id"];
};
