import type { EntityManager } from "@mikro-orm/core";
import type { IStoreStatusRepository } from "../../domain/ports/IStoreStatusRepository.ts";
import type { IStoreStatus } from "../../domain/models/IStoreStatus.ts";
import { StoreStatusModel } from "./models/StoreStatusModel.ts";
import { StoreModel } from "./models/StoreModel.ts";
import { UserModel } from "./models/UserModel.ts";

interface IMikroormStoreStatusRepositoryOptions {
	em: EntityManager;
}

export class MikroormStoreStatusRepository implements IStoreStatusRepository {
	private options: IMikroormStoreStatusRepositoryOptions;

	constructor(options: IMikroormStoreStatusRepositoryOptions) {
		this.options = options;
	}

	findById: IStoreStatusRepository["findById"] = async (id) => {
		const storeStatus = await this.options.em.findOne(
			StoreStatusModel,
			{ id },
			{
				populate: ["store", "changedByUser"],
			},
		);
		return storeStatus;
	};

	findByStoreId: IStoreStatusRepository["findByStoreId"] = async (storeId) => {
		const storeStatuses = await this.options.em.find(
			StoreStatusModel,
			{
				store: { id: storeId },
			},
			{
				populate: ["store", "changedByUser"],
				orderBy: { createdAt: "DESC" },
			},
		);
		return storeStatuses;
	};

	findCurrentStatus: IStoreStatusRepository["findCurrentStatus"] = async (
		storeId,
	) => {
		const currentStatus = await this.options.em.findOne(
			StoreStatusModel,
			{
				store: { id: storeId },
				isActive: true,
			},
			{
				populate: ["store", "changedByUser"],
				orderBy: { createdAt: "DESC" },
			},
		);
		return currentStatus;
	};

	findByChangedByUserId: IStoreStatusRepository["findByChangedByUserId"] =
		async (userId) => {
			const storeStatuses = await this.options.em.find(
				StoreStatusModel,
				{
					changedByUser: { id: userId },
				},
				{
					populate: ["store", "changedByUser"],
					orderBy: { createdAt: "DESC" },
				},
			);
			return storeStatuses;
		};

	findStoresByStatus: IStoreStatusRepository["findStoresByStatus"] = async (
		status,
	) => {
		const storeStatuses = await this.options.em.find(
			StoreStatusModel,
			{
				status,
				isActive: true,
			},
			{
				populate: ["store", "changedByUser"],
				orderBy: { createdAt: "DESC" },
			},
		);
		return storeStatuses;
	};

	findStatusHistory: IStoreStatusRepository["findStatusHistory"] = async (
		storeId,
		limit,
	) => {
		const storeStatuses = await this.options.em.find(
			StoreStatusModel,
			{
				store: { id: storeId },
			},
			{
				populate: ["store", "changedByUser"],
				orderBy: { createdAt: "DESC" },
				...(limit && { limit }),
			},
		);
		return storeStatuses;
	};

	create: IStoreStatusRepository["create"] = async (statusData) => {
		let store: StoreModel | null = null;
		if (statusData.storeId) {
			store = await this.options.em.findOne(StoreModel, {
				id: statusData.storeId,
			});
			if (!store) {
				throw new Error(`Store with id ${statusData.storeId} not found`);
			}
		}

		let changedByUser: UserModel | null = null;
		if (statusData.changedByUserId) {
			changedByUser = await this.options.em.findOne(UserModel, {
				id: statusData.changedByUserId,
			});
			if (!changedByUser) {
				throw new Error(`User with id ${statusData.changedByUserId} not found`);
			}
		}

		// Validation: s'assurer que store et changedByUser sont requis
		if (!store) {
			throw new Error("Store is required to create a store status");
		}
		if (!changedByUser) {
			throw new Error("Changed by user is required to create a store status");
		}

		if (statusData.isActive) {
			const currentActiveStatus = await this.options.em.findOne(
				StoreStatusModel,
				{
					store: { id: store.id },
					isActive: true,
				},
			);
			if (currentActiveStatus) {
				currentActiveStatus.isActive = false;
				await this.options.em.flush();
			}
		}

		const storeStatusModel = new StoreStatusModel({
			status: statusData.status,
			reason: statusData.reason,
			store: store,
			changedByUser: changedByUser,
			isActive: statusData.isActive,
		});

		await this.options.em.persistAndFlush(storeStatusModel);
		return storeStatusModel;
	};

	update: IStoreStatusRepository["update"] = async (id, statusData) => {
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
				throw new Error("Changed by user cannot be null for store status");
			}

			const changedByUser = await this.options.em.findOne(UserModel, {
				id: statusData.changedByUserId,
			});
			if (!changedByUser) {
				throw new Error(`User with id ${statusData.changedByUserId} not found`);
			}
			storeStatus.changedByUser = changedByUser;
		}

		const { storeId, changedByUserId, ...updateData } = statusData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(storeStatus, filteredUpdateData);
		await this.options.em.flush();
		return storeStatus as IStoreStatus;
	};

	delete: IStoreStatusRepository["delete"] = async (id) => {
		const storeStatus = await this.options.em.findOne(StoreStatusModel, { id });
		if (!storeStatus) {
			return;
		}

		await this.options.em.removeAndFlush(storeStatus);
	};
}
