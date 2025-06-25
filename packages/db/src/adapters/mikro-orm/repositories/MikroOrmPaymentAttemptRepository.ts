import { MikroOrmPaymentAttemptModel } from "../models/MikroOrmPaymentAttemptModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IPaymentAttemptRepository } from "../../../domain/ports/repositories/IPaymentAttemptRepository.ts";
import type {
	IInsertPaymentAttempt,
	IPaymentAttempt,
	IUpdatePaymentAttempt,
} from "../../../domain/models/IPaymentAttempt.ts";

export class MikroOrmPaymentAttemptRepository
	extends MikroOrmBaseRepository<
		IPaymentAttempt,
		IInsertPaymentAttempt,
		IUpdatePaymentAttempt
	>(MikroOrmPaymentAttemptModel)
	implements IPaymentAttemptRepository {}
