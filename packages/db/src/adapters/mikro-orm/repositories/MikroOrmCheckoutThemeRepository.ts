import { MikroOrmCheckoutThemeModel } from "../models/MikroOrmCheckoutThemeModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ICheckoutThemeRepository } from "../../../domain/ports/repositories/ICheckoutThemeRepository.ts";

export class MikroOrmCheckoutThemeRepository
	extends MikroOrmBaseRepository(MikroOrmCheckoutThemeModel)
	implements ICheckoutThemeRepository {}
