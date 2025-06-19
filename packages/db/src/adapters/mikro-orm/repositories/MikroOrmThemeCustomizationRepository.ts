import { MikroOrmThemeCustomizationModel } from "../models/MikroOrmThemeCustomizationModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IThemeCustomizationRepository } from "../../../domain/ports/repositories/IThemeCustomizationRepository.ts";
import type {
	IThemeCustomization,
	IThemeCustomizationInsert,
	IThemeCustomizationUpdate,
} from "../../../domain/models/ThemeCustomization.ts";

export class MikroOrmThemeCustomizationRepository
	extends MikroOrmBaseRepository<
		IThemeCustomization,
		IThemeCustomizationInsert,
		IThemeCustomizationUpdate
	>(MikroOrmThemeCustomizationModel)
	implements IThemeCustomizationRepository {}
