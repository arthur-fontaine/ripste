import type { IThemeCustomization, IThemeCustomizationInsert, IThemeCustomizationUpdate } from "../../models/ThemeCustomization.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IThemeCustomizationRepository
	extends IBaseRepository<IThemeCustomization, IThemeCustomizationInsert, IThemeCustomizationUpdate> {}
