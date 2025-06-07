import type { ICompany, IInsertCompany } from "../models/ICompany.ts";

export interface ICompanyRepository {
	findById(id: string): Promise<ICompany | null>;
	findByKbis(kbis: string): Promise<ICompany | null>;
	findByVatNumber(vatNumber: string): Promise<ICompany | null>;
	create(companyData: IInsertCompany): Promise<ICompany>;
	update(id: string, companyData: IInsertCompany): Promise<ICompany>;
	delete(id: string): Promise<void>;
}
