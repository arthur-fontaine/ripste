import { MikroOrmTransactionEventModel } from "../models/MikroOrmTransactionEventModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ITransactionEventRepository } from "../../../domain/ports/repositories/ITransactionEventRepository.ts";
import type {
	ITransactionEvent,
	IInsertTransactionEvent,
	IUpdateTransactionEvent,
} from "../../../domain/models/ITransactionEvent.ts";

export class MikroOrmTransactionEventRepository
	extends MikroOrmBaseRepository<
		ITransactionEvent,
		IInsertTransactionEvent,
		IUpdateTransactionEvent
	>(MikroOrmTransactionEventModel)
	implements ITransactionEventRepository {}
