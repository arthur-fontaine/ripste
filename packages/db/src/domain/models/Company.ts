import * as z from "./utils/zod-db.ts";
import { Store } from "./Store.ts";
import { zocker } from "zocker";

const companyTable = z.table({
	id: z.generated(z.string()),
	legalName: z.string(),
	tradeName: z.nullable(z.string()),
	kbis: z.string(),
	vatNumber: z.nullable(z.string()),
	address: z.nullable(z.string()),
	...z.timestamps(),
	stores: z.relation.many(() => Store),
});

export const Company = companyTable.select;
export interface ICompany extends z.infer<typeof Company> {}
export const generateFakeCompany = () => zocker(Company).generate();

export const CompanyInsert = companyTable.insert;
export interface ICompanyInsert extends z.infer<typeof CompanyInsert> {}
export const generateFakeCompanyInsert = () => zocker(CompanyInsert).generate();

export const CompanyUpdate = companyTable.update;
export interface ICompanyUpdate extends z.infer<typeof CompanyUpdate> {}
export const generateFakeCompanyUpdate = () => zocker(CompanyUpdate).generate();
