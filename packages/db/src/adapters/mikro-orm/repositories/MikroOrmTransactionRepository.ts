import { MikroOrmTransactionModel } from "../models/MikroOrmTransactionModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ITransactionRepository } from "../../../domain/ports/repositories/ITransactionRepository.ts";

export class MikroOrmTransactionRepository
	extends MikroOrmBaseRepository(MikroOrmTransactionModel)
	implements ITransactionRepository {}
