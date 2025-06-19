import { MikroOrmPaymentAttemptModel } from "../models/MikroOrmPaymentAttemptModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IPaymentAttemptRepository } from "../../../domain/ports/repositories/IPaymentAttemptRepository.ts";
import type { IPaymentAttempt, IPaymentAttemptInsert, IPaymentAttemptUpdate } from "../../../domain/models/PaymentAttempt.ts";

export class MikroOrmPaymentAttemptRepository
	extends MikroOrmBaseRepository<
		IPaymentAttempt,
		IPaymentAttemptInsert,
		IPaymentAttemptUpdate
	>(MikroOrmPaymentAttemptModel)
	implements IPaymentAttemptRepository {}
