import { MikroOrmTransactionModel } from "../models/MikroOrmTransactionModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ITransactionRepository } from "../../../domain/ports/repositories/ITransactionRepository.ts";
import type {
	ITransaction,
	ITransactionInsert,
	ITransactionUpdate,
} from "../../../domain/models/Transaction.ts";

export class MikroOrmTransactionRepository
	extends MikroOrmBaseRepository<
		ITransaction,
		ITransactionInsert,
		ITransactionUpdate
	>(MikroOrmTransactionModel)
	implements ITransactionRepository {}
