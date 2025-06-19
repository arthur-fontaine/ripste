import type { ICheckoutTheme, ICheckoutThemeInsert, ICheckoutThemeUpdate } from "../../models/CheckoutTheme.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ICheckoutThemeRepository
	extends IBaseRepository<ICheckoutTheme, ICheckoutThemeInsert, ICheckoutThemeUpdate> {}
