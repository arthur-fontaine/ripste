import type {
	IInsertAccount,
	IUpdateAccount,
	IAccount,
} from "../../../domain/models/IAccount.ts";
import type { IAccountRepository } from "../../../domain/ports/repositories/IAccountRepository.ts";
import { MikroOrmAccountModel } from "../models/MikroOrmAccountModel.ts";
import { MikroOrmUserModel } from "../models/MikroOrmUserModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import { Reference, type EntityManager } from "@mikro-orm/core";

export class MikroOrmAccountRepository
	extends MikroOrmBaseRepository<IAccount, IInsertAccount, IUpdateAccount>(
		MikroOrmAccountModel,
	)
	implements IAccountRepository
{
	constructor(options: { em: EntityManager }) {
		super(options);
		this.insert = async (entity: IInsertAccount): Promise<IAccount> => {
			const { userId, ...accountData } = entity;
			const newAccount = this._em.create(
				MikroOrmAccountModel,
				accountData as never,
			);
			const userRef = this._em.getReference(MikroOrmUserModel, userId);
			newAccount.user = Reference.create(userRef);

			await this._em.persistAndFlush(newAccount);
			return newAccount;
		};
	}
}
