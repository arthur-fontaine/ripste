import type {
	IThemeCustomization,
	IInsertThemeCustomization,
	IUpdateThemeCustomization,
} from "../../models/IThemeCustomization.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IThemeCustomizationRepository
	extends IBaseRepository<
		IThemeCustomization,
		IInsertThemeCustomization,
		IUpdateThemeCustomization
	> {}
