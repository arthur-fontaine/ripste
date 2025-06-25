import type {
	ITransaction,
	IInsertTransaction,
	IUpdateTransaction,
} from "../../models/ITransaction.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ITransactionRepository
	extends IBaseRepository<
		ITransaction,
		IInsertTransaction,
		IUpdateTransaction
	> {}
