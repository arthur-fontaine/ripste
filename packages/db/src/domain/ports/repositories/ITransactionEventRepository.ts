import type {
	ITransactionEvent,
	IInsertTransactionEvent,
	IUpdateTransactionEvent,
} from "../../models/ITransactionEvent.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ITransactionEventRepository
	extends IBaseRepository<
		ITransactionEvent,
		IInsertTransactionEvent,
		IUpdateTransactionEvent
	> {}
