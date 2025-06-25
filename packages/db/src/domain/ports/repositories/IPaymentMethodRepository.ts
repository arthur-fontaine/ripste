import type {
	IPaymentMethod,
	IInsertPaymentMethod,
	IUpdatePaymentMethod,
} from "../../models/IPaymentMethod.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IPaymentMethodRepository
	extends IBaseRepository<
		IPaymentMethod,
		IInsertPaymentMethod,
		IUpdatePaymentMethod
	> {}
