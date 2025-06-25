import { MikroOrmCheckoutThemeModel } from "../models/MikroOrmCheckoutThemeModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ICheckoutThemeRepository } from "../../../domain/ports/repositories/ICheckoutThemeRepository.ts";
import type {
	ICheckoutTheme,
	IInsertCheckoutTheme,
	IUpdateCheckoutTheme,
} from "../../../domain/models/ICheckoutTheme.ts";

export class MikroOrmCheckoutThemeRepository
	extends MikroOrmBaseRepository<
		ICheckoutTheme,
		IInsertCheckoutTheme,
		IUpdateCheckoutTheme
	>(MikroOrmCheckoutThemeModel)
	implements ICheckoutThemeRepository {}
