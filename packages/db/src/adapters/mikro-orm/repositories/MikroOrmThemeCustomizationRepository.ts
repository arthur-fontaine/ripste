import { MikroOrmThemeCustomizationModel } from "../models/MikroOrmThemeCustomizationModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IThemeCustomizationRepository } from "../../../domain/ports/repositories/IThemeCustomizationRepository.ts";
import type {
	IThemeCustomization,
	IInsertThemeCustomization,
	IUpdateThemeCustomization,
} from "../../../domain/models/IThemeCustomization.ts";

export class MikroOrmThemeCustomizationRepository
	extends MikroOrmBaseRepository<
		IThemeCustomization,
		IInsertThemeCustomization,
		IUpdateThemeCustomization
	>(MikroOrmThemeCustomizationModel)
	implements IThemeCustomizationRepository {}
