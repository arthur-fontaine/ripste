import { MikroOrmCompanyModel } from "../models/MikroOrmCompanyModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ICompanyRepository } from "../../../domain/ports/repositories/ICompanyRepository.ts";
import type {
	ICompany,
	IInsertCompany,
	IUpdateCompany,
} from "../../../domain/models/ICompany.ts";
import { MikroOrmUserModel } from "../models/MikroOrmUserModel.ts";
import type { EntityManager } from "@mikro-orm/core";

export class MikroOrmCompanyRepository
	extends MikroOrmBaseRepository<ICompany, IInsertCompany, IUpdateCompany>(
		MikroOrmCompanyModel,
	)
	implements ICompanyRepository
{
	constructor(options: { em: EntityManager }) {
		super(options);
		this.insert = async (entity: IInsertCompany): Promise<ICompany> => {
			const { userId, ...companyData } = entity;
			const newCompany = this._em.create(
				MikroOrmCompanyModel,
				companyData as never,
			);
			const userRef = this._em.getReference(MikroOrmUserModel, userId);
			newCompany.user = userRef;

			await this._em.persistAndFlush(newCompany);
			return newCompany;
		};
	}
}
