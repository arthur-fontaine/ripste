import type {
	ICheckoutPage,
	ICheckoutPageInsert,
	ICheckoutPageUpdate,
} from "../../models/CheckoutPage.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ICheckoutPageRepository
	extends IBaseRepository<
		ICheckoutPage,
		ICheckoutPageInsert,
		ICheckoutPageUpdate
	> {}
