import { MikroOrmPaymentAttemptModel } from "../models/MikroOrmPaymentAttemptModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IPaymentAttemptRepository } from "../../../domain/ports/repositories/IPaymentAttemptRepository.ts";

export class MikroOrmPaymentAttemptRepository
	extends MikroOrmBaseRepository(MikroOrmPaymentAttemptModel)
	implements IPaymentAttemptRepository {}
