import type {
	ICompany,
	IInsertCompany,
	IUpdateCompany,
} from "../../models/ICompany.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ICompanyRepository
	extends IBaseRepository<ICompany, IInsertCompany, IUpdateCompany> {}
