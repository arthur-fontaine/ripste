import { MikroOrmPaymentMethodModel } from "../models/MikroOrmPaymentMethodModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IPaymentMethodRepository } from "../../../domain/ports/repositories/IPaymentMethodRepository.ts";

export class MikroOrmPaymentMethodRepository
	extends MikroOrmBaseRepository(MikroOrmPaymentMethodModel)
	implements IPaymentMethodRepository {}
