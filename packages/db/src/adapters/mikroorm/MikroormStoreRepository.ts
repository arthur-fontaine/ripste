import type { EntityManager } from "@mikro-orm/core";
import type { IStoreRepository } from "../../domain/ports/IStoreRepository.ts";
import type { IStore } from "../../domain/models/IStore.ts";
import type { IStoreStatus } from "../../domain/models/IStoreStatus.ts";
import { StoreModel } from "./models/StoreModel.ts";
import { CompanyModel } from "./models/CompanyModel.ts";
import { StoreStatusModel } from "./models/StoreStatusModel.ts";
import { UserModel } from "./models/UserModel.ts";

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

	findMany: IStoreRepository["findMany"] = async (params) => {
		interface WhereClause {
			company?: { id: string };
		}

		const whereClause: WhereClause = {};

		if (params.companyId) {
			whereClause.company = { id: params.companyId };
		}

		const stores = await this.options.em.find(StoreModel, whereClause, {
			populate: ["company"],
		});
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

	getStatus: IStoreRepository["getStatus"] = async (params) => {
		interface WhereClause {
			store?: { id: string };
			changedByUser?: { id: string };
			status?: IStoreStatus["status"];
		}

		const whereClause: WhereClause = {};

		if (params.storeId) {
			whereClause.store = { id: params.storeId };
		}

		if (params.changedByUserId) {
			whereClause.changedByUser = { id: params.changedByUserId };
		}

		if (params.status) {
			whereClause.status = params.status;
		}

		const options = {
			populate: ["store", "changedByUser"] as const,
			orderBy: { createdAt: "DESC" as const },
			...(params.limit && { limit: params.limit }),
		};

		const statuses = await this.options.em.find(
			StoreStatusModel,
			whereClause,
			options,
		);
		return statuses;
	};

	addStatus: IStoreRepository["addStatus"] = async (statusData) => {
		if (!statusData.storeId) {
			throw new Error("storeId is required for creating store status");
		}

		if (!statusData.changedByUserId) {
			throw new Error("changedByUserId is required for creating store status");
		}

		const store = await this.options.em.findOne(StoreModel, {
			id: statusData.storeId,
		});
		if (!store) {
			throw new Error(`Store with id ${statusData.storeId} not found`);
		}

		const changedByUser = await this.options.em.findOne(UserModel, {
			id: statusData.changedByUserId,
		});
		if (!changedByUser) {
			throw new Error(`User with id ${statusData.changedByUserId} not found`);
		}

		const statusModel = new StoreStatusModel({
			status: statusData.status,
			reason: statusData.reason,
			store,
			changedByUser,
		});

		await this.options.em.persistAndFlush(statusModel);
		return statusModel;
	};

	updateStatus: IStoreRepository["updateStatus"] = async (id, statusData) => {
		const storeStatus = await this.options.em.findOne(StoreStatusModel, { id });
		if (!storeStatus) {
			throw new Error(`StoreStatus with id ${id} not found`);
		}

		if (statusData.storeId !== undefined) {
			if (statusData.storeId === null) {
				throw new Error("Store cannot be null for store status");
			}
			const store = await this.options.em.findOne(StoreModel, {
				id: statusData.storeId,
			});
			if (!store) {
				throw new Error(`Store with id ${statusData.storeId} not found`);
			}
			storeStatus.store = store;
		}

		if (statusData.changedByUserId !== undefined) {
			if (statusData.changedByUserId === null) {
				throw new Error("ChangedByUser cannot be null for store status");
			}
			const user = await this.options.em.findOne(UserModel, {
				id: statusData.changedByUserId,
			});
			if (!user) {
				throw new Error(`User with id ${statusData.changedByUserId} not found`);
			}
			storeStatus.changedByUser = user;
		}

		const { storeId, changedByUserId, ...updateData } = statusData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(storeStatus, filteredUpdateData);
		await this.options.em.flush();
		return storeStatus as IStoreStatus;
	};

	deleteStatus: IStoreRepository["deleteStatus"] = async (id) => {
		const storeStatus = await this.options.em.findOne(StoreStatusModel, { id });
		if (!storeStatus) {
			return;
		}

		await this.options.em.removeAndFlush(storeStatus);
	};
}
