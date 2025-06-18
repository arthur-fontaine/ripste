import type { EntityManager, FilterQuery } from "@mikro-orm/core";
import type { ICompanyRepository } from "../../domain/ports/ICompanyRepository.ts";
import type { ICompany } from "../../domain/models/ICompany.ts";
import { CompanyModel } from "./models/CompanyModel.ts";

interface IMikroormCompanyRepositoryOptions {
	em: EntityManager;
}

export class MikroormCompanyRepository implements ICompanyRepository {
	private options: IMikroormCompanyRepositoryOptions;

	constructor(options: IMikroormCompanyRepositoryOptions) {
		this.options = options;
	}

	findById: ICompanyRepository["findById"] = async (id) => {
		const company = await this.options.em.findOne(
			CompanyModel,
			{
				id,
				deletedAt: null,
			},
			{
				populate: ["stores"],
			},
		);
		return company;
	};

	findMany: ICompanyRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<CompanyModel> = {
			deletedAt: null,
		};

		if (params.kbis) whereClause.kbis = params.kbis;

		if (params.vatNumber) whereClause.vatNumber = params.vatNumber;

		const companies = await this.options.em.find(CompanyModel, whereClause, {
			populate: ["stores"],
		});
		return companies;
	};

	create: ICompanyRepository["create"] = async (companyData) => {
		const companyModel = new CompanyModel({
			legalName: companyData.legalName,
			tradeName: companyData.tradeName,
			kbis: companyData.kbis,
			vatNumber: companyData.vatNumber,
			address: companyData.address,
		});

		await this.options.em.persistAndFlush(companyModel);
		return companyModel;
	};

	update: ICompanyRepository["update"] = async (id, companyData) => {
		const company = await this.options.em.findOne(CompanyModel, {
			id,
			deletedAt: null,
		});
		if (!company) {
			throw new Error(`Company with id ${id} not found`);
		}

		const filteredCompanyData = Object.fromEntries(
			Object.entries(companyData).filter(([_, value]) => value !== undefined),
		);
		this.options.em.assign(company, filteredCompanyData);
		await this.options.em.flush();
		return company as ICompany;
	};

	delete: ICompanyRepository["delete"] = async (id) => {
		const company = await this.options.em.findOne(CompanyModel, {
			id,
			deletedAt: null,
		});
		if (!company) {
			return;
		}

		company.deletedAt = new Date();
		await this.options.em.flush();
	};
}
