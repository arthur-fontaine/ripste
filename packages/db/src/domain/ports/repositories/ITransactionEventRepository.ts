import type { ITransactionEvent } from "../../models/TransactionEvent.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ITransactionEventRepository
	extends IBaseRepository<ITransactionEvent> {}
