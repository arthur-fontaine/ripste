import type { IBaseRepository } from "./utils/IBaseRepository.ts";
import type {
	IAccount,
	IInsertAccount,
	IUpdateAccount,
} from "../../models/IAccount.ts";

export interface IAccountRepository
	extends IBaseRepository<IAccount, IInsertAccount, IUpdateAccount> {}
