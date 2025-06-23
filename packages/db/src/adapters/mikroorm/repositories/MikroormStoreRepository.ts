import type { FilterQuery } from "@mikro-orm/core";
import type { IStoreRepository } from "../../../domain/ports/IStoreRepository.ts";
import type { IStoreStatus } from "../../../domain/models/IStoreStatus.ts";
import { StoreModel } from "../models/StoreModel.ts";
import { CompanyModel } from "../models/CompanyModel.ts";
import { StoreStatusModel } from "../models/StoreStatusModel.ts";
import { UserModel } from "../models/UserModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

const POPULATE_FIELDS = ["company"] as const;

export class MikroormStoreRepository implements IStoreRepository {
	private options: RepoUtils.IMikroormRepositoryOptions;

	constructor(options: RepoUtils.IMikroormRepositoryOptions) {
		this.options = options;
	}

	findById: IStoreRepository["findById"] = async (id) => {
		return RepoUtils.findById(this.options.em, StoreModel, id, POPULATE_FIELDS);
	};

	findMany: IStoreRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<StoreModel> = {};

		if (params.companyId) {
			whereClause.company = { id: params.companyId };
		}

		return RepoUtils.findMany(
			this.options.em,
			StoreModel,
			whereClause,
			POPULATE_FIELDS,
		);
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
				deletedAt: null,
			});
			if (company) {
				storeModel.company = company;
			}
		}

		await this.options.em.persistAndFlush(storeModel);
		return storeModel;
	};

	update: IStoreRepository["update"] = async (id, storeData) => {
		const updateData: Record<string, unknown> = {
			name: storeData.name,
			slug: storeData.slug,
			contactEmail: storeData.contactEmail,
			contactPhone: storeData.contactPhone,
		};

		if (storeData.companyId !== undefined) {
			if (storeData.companyId === null) {
				updateData["company"] = null;
			} else {
				const company = await RepoUtils.findRelatedEntity(
					this.options.em,
					CompanyModel,
					storeData.companyId,
					"Company",
				);
				updateData["company"] = company;
			}
		}

		return await RepoUtils.updateEntity(
			this.options.em,
			StoreModel,
			id,
			updateData,
			["company"],
		);
	};

	delete: IStoreRepository["delete"] = async (id) => {
		await RepoUtils.deleteEntity(this.options.em, StoreModel, id);
	};

	getStatuses: IStoreRepository["getStatuses"] = async (params) => {
		const whereClause: FilterQuery<StoreStatusModel> = {
			deletedAt: null,
		};

		if (params.storeId) whereClause.store = { id: params.storeId };

		if (params.changedByUserId)
			whereClause.changedByUser = { id: params.changedByUserId };

		if (params.status) whereClause.status = params.status;

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

		const store = await RepoUtils.findRelatedEntity(
			this.options.em,
			StoreModel,
			statusData.storeId,
			"Store",
		);

		const changedByUser = await RepoUtils.findRelatedEntity(
			this.options.em,
			UserModel,
			statusData.changedByUserId,
			"User",
		);

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
		const storeStatus = await this.options.em.findOne(StoreStatusModel, {
			id,
			deletedAt: null,
		});
		if (!storeStatus) {
			throw new Error(`StoreStatus with id ${id} not found`);
		}

		if (statusData.storeId !== undefined) {
			if (statusData.storeId === null) {
				throw new Error("Store cannot be null for store status");
			}
			const store = await RepoUtils.findRelatedEntity(
				this.options.em,
				StoreModel,
				statusData.storeId,
				"Store",
			);
			storeStatus.store = store;
		}

		if (statusData.changedByUserId !== undefined) {
			if (statusData.changedByUserId === null) {
				throw new Error("ChangedByUser cannot be null for store status");
			}
			const user = await RepoUtils.findRelatedEntity(
				this.options.em,
				UserModel,
				statusData.changedByUserId,
				"User",
			);
			storeStatus.changedByUser = user;
		}

		const { storeId, changedByUserId, ...updateData } = statusData;
		const filteredUpdateData = RepoUtils.filterUpdateData(updateData);

		this.options.em.assign(storeStatus, filteredUpdateData);
		await this.options.em.flush();
		return storeStatus as IStoreStatus;
	};

	getLastStatus: IStoreRepository["getLastStatus"] = async (storeId) => {
		const storeStatus = await this.options.em.findOne(
			StoreStatusModel,
			{
				store: { id: storeId },
				deletedAt: null,
			},
			{
				orderBy: { createdAt: "DESC" },
				populate: ["store", "changedByUser"],
			},
		);
		return storeStatus;
	};

	deleteStatus: IStoreRepository["deleteStatus"] = async (id) => {
		await RepoUtils.deleteEntity(this.options.em, StoreStatusModel, id);
	};
}
