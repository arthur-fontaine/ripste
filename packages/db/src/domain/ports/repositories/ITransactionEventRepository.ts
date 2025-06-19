import type {
	ITransactionEvent,
	ITransactionEventInsert,
	ITransactionEventUpdate,
} from "../../models/TransactionEvent.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ITransactionEventRepository
	extends IBaseRepository<
		ITransactionEvent,
		ITransactionEventInsert,
		ITransactionEventUpdate
	> {}
