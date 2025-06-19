import { MikroOrmTransactionEventModel } from "../models/MikroOrmTransactionEventModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ITransactionEventRepository } from "../../../domain/ports/ITransactionEventRepository.ts";

export class MikroOrmTransactionEventRepository
	extends MikroOrmBaseRepository(MikroOrmTransactionEventModel)
	implements ITransactionEventRepository {}
