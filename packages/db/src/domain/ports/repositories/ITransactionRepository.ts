import type { ITransaction, ITransactionInsert, ITransactionUpdate } from "../../models/Transaction.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ITransactionRepository extends IBaseRepository<ITransaction, ITransactionInsert, ITransactionUpdate> {}
