import { MikroOrmCompanyModel } from "../models/MikroOrmCompanyModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ICompanyRepository } from "../../../domain/ports/repositories/ICompanyRepository.ts";
import type {
	ICompany,
	IInsertCompany,
	IUpdateCompany,
} from "../../../domain/models/ICompany.ts";

export class MikroOrmCompanyRepository
	extends MikroOrmBaseRepository<ICompany, IInsertCompany, IUpdateCompany>(
		MikroOrmCompanyModel,
	)
	implements ICompanyRepository {}
