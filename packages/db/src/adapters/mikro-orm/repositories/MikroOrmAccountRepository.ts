import type {
	IInsertAccount,
	IUpdateAccount,
	IAccount,
} from "../../../domain/models/IAccount.ts";
import type { IAccountRepository } from "../../../domain/ports/repositories/IAccountRepository.ts";
import { MikroOrmAccountModel } from "../models/MikroOrmAccountModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmAccountRepository
	extends MikroOrmBaseRepository<IAccount, IInsertAccount, IUpdateAccount>(
		MikroOrmAccountModel,
	)
	implements IAccountRepository {}
