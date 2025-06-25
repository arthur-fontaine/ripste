import type {
	ICheckoutTheme,
	IInsertCheckoutTheme,
	IUpdateCheckoutTheme,
} from "../../models/ICheckoutTheme.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ICheckoutThemeRepository
	extends IBaseRepository<
		ICheckoutTheme,
		IInsertCheckoutTheme,
		IUpdateCheckoutTheme
	> {}
