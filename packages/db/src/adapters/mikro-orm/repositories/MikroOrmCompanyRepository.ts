import { MikroOrmCompanyModel } from "../models/MikroOrmCompanyModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ICompanyRepository } from "../../../domain/ports/ICompanyRepository.ts";

export class MikroOrmCompanyRepository
	extends MikroOrmBaseRepository(MikroOrmCompanyModel)
	implements ICompanyRepository {}
