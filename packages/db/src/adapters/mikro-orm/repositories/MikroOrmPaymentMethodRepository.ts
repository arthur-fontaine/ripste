import { MikroOrmPaymentMethodModel } from "../models/MikroOrmPaymentMethodModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IPaymentMethodRepository } from "../../../domain/ports/repositories/IPaymentMethodRepository.ts";
import type {
	IPaymentMethod,
	IPaymentMethodInsert,
	IPaymentMethodUpdate,
} from "../../../domain/models/PaymentMethod.ts";

export class MikroOrmPaymentMethodRepository
	extends MikroOrmBaseRepository<
		IPaymentMethod,
		IPaymentMethodInsert,
		IPaymentMethodUpdate
	>(MikroOrmPaymentMethodModel)
	implements IPaymentMethodRepository {}
