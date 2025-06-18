import type { ICompany, IInsertCompany } from "../models/ICompany.ts";

export interface ICompanyRepository {
	findById(id: string): Promise<ICompany | null>;
	findMany(params: { kbis?: string; vatNumber?: string }): Promise<ICompany[]>;
	create(companyData: IInsertCompany): Promise<ICompany>;
	update(id: string, companyData: IInsertCompany): Promise<ICompany>;
	delete(id: string): Promise<void>;
}
