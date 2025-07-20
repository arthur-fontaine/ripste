import { MikroOrmCompanyModel } from "../models/MikroOrmCompanyModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ICompanyRepository } from "../../../domain/ports/repositories/ICompanyRepository.ts";
import type {
	ICompany,
	IInsertCompany,
	IUpdateCompany,
} from "../../../domain/models/ICompany.ts";
import { randomUUID } from "node:crypto";

export class MikroOrmCompanyRepository
	extends MikroOrmBaseRepository<ICompany, IInsertCompany, IUpdateCompany>(
		MikroOrmCompanyModel,
	)
	implements ICompanyRepository
{
	override delete = async (id: string): Promise<boolean> => {
		const entity = await this._em.findOne(MikroOrmCompanyModel, { id });
		if (!entity) {
			return false;
		}

		entity.deletedAt = new Date();
		entity.kbis = `${entity.kbis}_DELETED_${randomUUID().slice(0, 8)}`;

		await this._em.persistAndFlush(entity);
		return true;
	};
}
