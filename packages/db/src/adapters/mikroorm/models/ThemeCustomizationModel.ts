import { Entity, Property, t, ManyToOne, Enum } from "@mikro-orm/core";
import { BaseModel } from "./BaseModel.ts";
import type { IThemeCustomization } from "../../../domain/models/IThemeCustomization.ts";
import { CheckoutThemeModel } from "./CheckoutThemeModel.ts";

const CustomizationType = {
	CSS: "css",
} as const;

@Entity()
export class ThemeCustomizationModel
	extends BaseModel
	implements IThemeCustomization
{
	@Enum(() => CustomizationType)
	customizationType: "css";

	@Property({ type: t.string, nullable: true })
	content: string | null;

	@ManyToOne(() => CheckoutThemeModel)
	theme: CheckoutThemeModel;

	get themeId(): string {
		return this.theme.id;
	}

	constructor({
		customizationType,
		theme,
		content,
	}: Pick<ThemeCustomizationModel, "customizationType" | "theme"> &
		Partial<Pick<ThemeCustomizationModel, "content">>) {
		super();
		this.customizationType = customizationType;
		this.content = content ?? null;
		this.theme = theme;
	}
}
