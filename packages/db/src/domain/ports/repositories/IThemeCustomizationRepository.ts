import type { IThemeCustomization } from "../../models/ThemeCustomization.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IThemeCustomizationRepository
	extends IBaseRepository<IThemeCustomization> {}
