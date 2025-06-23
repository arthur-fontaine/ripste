import type { EntityManager, FilterQuery } from "@mikro-orm/core";
import type { ICompanyRepository } from "../../../domain/ports/ICompanyRepository.ts";
import type { ICompany } from "../../../domain/models/ICompany.ts";
import { CompanyModel } from "../models/CompanyModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

const POPULATE_FIELDS = ["stores"] as const;

interface IMikroormCompanyRepositoryOptions {
	em: EntityManager;
}

export class MikroormCompanyRepository implements ICompanyRepository {
	private options: IMikroormCompanyRepositoryOptions;

	constructor(options: IMikroormCompanyRepositoryOptions) {
		this.options = options;
	}

	findById: ICompanyRepository["findById"] = async (id) => {
		return RepoUtils.findById<ICompany, CompanyModel>(
			this.options.em,
			CompanyModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: ICompanyRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<CompanyModel> = {};

		if (params.kbis) whereClause.kbis = params.kbis;
		if (params.vatNumber) whereClause.vatNumber = params.vatNumber;

		return RepoUtils.findMany<ICompany, CompanyModel>(
			this.options.em,
			CompanyModel,
			whereClause,
			POPULATE_FIELDS,
		);
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
		return RepoUtils.updateEntity<ICompany, CompanyModel>(
			this.options.em,
			CompanyModel,
			id,
			RepoUtils.filterUpdateData(companyData),
			POPULATE_FIELDS,
		);
	};

	delete: ICompanyRepository["delete"] = async (id) => {
		return RepoUtils.deleteEntity<ICompany, CompanyModel>(
			this.options.em,
			CompanyModel,
			id,
		);
	};
}
