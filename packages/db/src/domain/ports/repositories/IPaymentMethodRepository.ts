import type { IPaymentMethod } from "../../models/PaymentMethod.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IPaymentMethodRepository
	extends IBaseRepository<IPaymentMethod> {}
