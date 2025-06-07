import type {
	IInsertThemeCustomization,
	IThemeCustomization,
} from "../models/IThemeCustomization.ts";

export interface IThemeCustomizationRepository {
	findById(id: string): Promise<IThemeCustomization | null>;
	findByThemeId(themeId: string): Promise<IThemeCustomization[]>;
	findByCustomizationType(
		customizationType: IThemeCustomization["customizationType"],
	): Promise<IThemeCustomization[]>;
	findByThemeAndType(
		themeId: string,
		customizationType: IThemeCustomization["customizationType"],
	): Promise<IThemeCustomization | null>;
	create(
		customizationData: IInsertThemeCustomization,
	): Promise<IThemeCustomization>;
	update(
		id: string,
		customizationData: IInsertThemeCustomization,
	): Promise<IThemeCustomization>;
	delete(id: string): Promise<void>;
	deleteByThemeId(themeId: string): Promise<void>;
}
