import { MikroOrmThemeCustomizationModel } from "../models/MikroOrmThemeCustomizationModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IThemeCustomizationRepository } from "../../../domain/ports/IThemeCustomizationRepository.ts";

export class MikroOrmThemeCustomizationRepository
	extends MikroOrmBaseRepository(MikroOrmThemeCustomizationModel)
	implements IThemeCustomizationRepository {}
