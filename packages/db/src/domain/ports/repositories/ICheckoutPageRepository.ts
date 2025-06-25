import type {
	ICheckoutPage,
	IInsertCheckoutPage,
	IUpdateCheckoutPage,
} from "../../models/ICheckoutPage.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ICheckoutPageRepository
	extends IBaseRepository<
		ICheckoutPage,
		IInsertCheckoutPage,
		IUpdateCheckoutPage
	> {}
