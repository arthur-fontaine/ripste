import { MikroOrmTransactionModel } from "../models/MikroOrmTransactionModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ITransactionRepository } from "../../../domain/ports/repositories/ITransactionRepository.ts";
import type {
	ITransaction,
	IInsertTransaction,
	IUpdateTransaction,
} from "../../../domain/models/ITransaction.ts";

export class MikroOrmTransactionRepository
	extends MikroOrmBaseRepository<
		ITransaction,
		IInsertTransaction,
		IUpdateTransaction
	>(MikroOrmTransactionModel)
	implements ITransactionRepository {}
