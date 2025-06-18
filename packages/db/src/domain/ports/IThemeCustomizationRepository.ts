import type {
	IInsertThemeCustomization,
	IThemeCustomization,
} from "../models/IThemeCustomization.ts";

export interface IThemeCustomizationRepository {
	findById(id: string): Promise<IThemeCustomization | null>;
	findMany(params: {
		themeId?: string;
		customizationType?: IThemeCustomization["customizationType"];
	}): Promise<IThemeCustomization[]>;
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
