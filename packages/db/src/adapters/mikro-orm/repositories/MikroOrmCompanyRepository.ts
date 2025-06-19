import { MikroOrmCompanyModel } from "../models/MikroOrmCompanyModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ICompanyRepository } from "../../../domain/ports/repositories/ICompanyRepository.ts";
import type {
	ICompany,
	ICompanyInsert,
	ICompanyUpdate,
} from "../../../domain/models/Company.ts";

export class MikroOrmCompanyRepository
	extends MikroOrmBaseRepository<ICompany, ICompanyInsert, ICompanyUpdate>(
		MikroOrmCompanyModel,
	)
	implements ICompanyRepository {}
