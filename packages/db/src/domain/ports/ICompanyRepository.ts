import type { Company } from "../models/Company.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface ICompanyRepository extends IBaseRepository<Company> {}
