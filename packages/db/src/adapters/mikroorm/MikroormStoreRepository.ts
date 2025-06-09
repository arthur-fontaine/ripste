import type { EntityManager } from "@mikro-orm/core";
import type { IStoreRepository } from "../../domain/ports/IStoreRepository.ts";
import type { IStore } from "../../domain/models/IStore.ts";
import { StoreModel } from "./models/StoreModel.ts";
import { CompanyModel } from "./models/CompanyModel.ts";

interface IMikroormStoreRepositoryOptions {
	em: EntityManager;
}

export class MikroormStoreRepository implements IStoreRepository {
	private options: IMikroormStoreRepositoryOptions;

	constructor(options: IMikroormStoreRepositoryOptions) {
		this.options = options;
	}

	findById: IStoreRepository["findById"] = async (id) => {
		const store = await this.options.em.findOne(
			StoreModel,
			{ id },
			{
				populate: ["company"],
			},
		);
		return store;
	};

	findByCompanyId: IStoreRepository["findByCompanyId"] = async (companyId) => {
		const stores = await this.options.em.find(
			StoreModel,
			{
				company: { id: companyId },
			},
			{
				populate: ["company"],
			},
		);
		return stores;
	};

	create: IStoreRepository["create"] = async (storeData) => {
		const storeModel = new StoreModel({
			name: storeData.name,
			slug: storeData.slug,
			contactEmail: storeData.contactEmail,
			contactPhone: storeData.contactPhone,
		});

		if (storeData.companyId) {
			const company = await this.options.em.findOne(CompanyModel, {
				id: storeData.companyId,
			});
			if (company) {
				storeModel.company = company;
			}
		}

		await this.options.em.persistAndFlush(storeModel);
		return storeModel;
	};

	update: IStoreRepository["update"] = async (id, storeData) => {
		const store = await this.options.em.findOne(StoreModel, { id });
		if (!store) {
			throw new Error(`Store with id ${id} not found`);
		}

		if (storeData.companyId !== undefined) {
			if (storeData.companyId === null) {
				store.company = null;
			} else {
				const company = await this.options.em.findOne(CompanyModel, {
					id: storeData.companyId,
				});
				if (company) {
					store.company = company;
				}
			}
		}

		const updateData = {
			name: storeData.name,
			slug: storeData.slug,
			contactEmail: storeData.contactEmail,
			contactPhone: storeData.contactPhone,
		};

		this.options.em.assign(store, updateData);
		await this.options.em.flush();
		return store as IStore;
	};

	delete: IStoreRepository["delete"] = async (id) => {
		const store = await this.options.em.findOne(StoreModel, { id });
		if (!store) {
			return;
		}

		await this.options.em.removeAndFlush(store);
	};
}
