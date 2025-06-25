import { MikroOrmPaymentMethodModel } from "../models/MikroOrmPaymentMethodModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IPaymentMethodRepository } from "../../../domain/ports/repositories/IPaymentMethodRepository.ts";
import type {
	IInsertPaymentMethod,
	IPaymentMethod,
	IUpdatePaymentMethod,
} from "../../../domain/models/IPaymentMethod.ts";

export class MikroOrmPaymentMethodRepository
	extends MikroOrmBaseRepository<
		IPaymentMethod,
		IInsertPaymentMethod,
		IUpdatePaymentMethod
	>(MikroOrmPaymentMethodModel)
	implements IPaymentMethodRepository {}
