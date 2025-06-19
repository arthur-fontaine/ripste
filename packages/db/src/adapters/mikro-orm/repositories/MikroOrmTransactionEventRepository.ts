import { MikroOrmTransactionEventModel } from "../models/MikroOrmTransactionEventModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ITransactionEventRepository } from "../../../domain/ports/repositories/ITransactionEventRepository.ts";
import type {
	ITransactionEvent,
	ITransactionEventInsert,
	ITransactionEventUpdate,
} from "../../../domain/models/TransactionEvent.ts";

export class MikroOrmTransactionEventRepository
	extends MikroOrmBaseRepository<
		ITransactionEvent,
		ITransactionEventInsert,
		ITransactionEventUpdate
	>(MikroOrmTransactionEventModel)
	implements ITransactionEventRepository {}
