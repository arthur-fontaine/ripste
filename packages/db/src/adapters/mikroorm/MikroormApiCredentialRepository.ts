import type { EntityManager } from "@mikro-orm/core";
import type { IApiCredentialRepository } from "../../domain/ports/IApiCredentialRepository.ts";
import { ApiCredentialModel } from "./models/ApiCredentialModel.ts";
import { StoreModel } from "./models/StoreModel.ts";
import { UserModel } from "./models/UserModel.ts";

interface IMikroormApiCredentialRepositoryOptions {
	em: EntityManager;
}

export class MikroormApiCredentialRepository
	implements IApiCredentialRepository
{
	private options: IMikroormApiCredentialRepositoryOptions;

	constructor(options: IMikroormApiCredentialRepositoryOptions) {
		this.options = options;
	}

	findById: IApiCredentialRepository["findById"] = async (id) => {
		const credential = await this.options.em.findOne(
			ApiCredentialModel,
			{ id },
			{
				populate: [
					"store",
					"createdByUser",
					"jwtToken",
					"oauth2Client",
					"transactions",
				],
			},
		);
		return credential;
	};

	findByStoreId: IApiCredentialRepository["findByStoreId"] = async (
		storeId,
	) => {
		const credentials = await this.options.em.find(
			ApiCredentialModel,
			{
				store: { id: storeId },
			},
			{
				populate: [
					"store",
					"createdByUser",
					"jwtToken",
					"oauth2Client",
					"transactions",
				],
			},
		);
		return credentials;
	};

	findByCreatedByUserId: IApiCredentialRepository["findByCreatedByUserId"] =
		async (userId) => {
			const credentials = await this.options.em.find(
				ApiCredentialModel,
				{
					createdByUser: { id: userId },
				},
				{
					populate: [
						"store",
						"createdByUser",
						"jwtToken",
						"oauth2Client",
						"transactions",
					],
				},
			);
			return credentials;
		};

	findByCredentialType: IApiCredentialRepository["findByCredentialType"] =
		async (credentialType) => {
			const credentials = await this.options.em.find(
				ApiCredentialModel,
				{ credentialType },
				{
					populate: [
						"store",
						"createdByUser",
						"jwtToken",
						"oauth2Client",
						"transactions",
					],
				},
			);
			return credentials;
		};

	findActiveCredentials: IApiCredentialRepository["findActiveCredentials"] =
		async (storeId) => {
			const whereClause: {
				isActive: boolean;
				$or: Array<{ expiresAt: null } | { expiresAt: { $gt: Date } }>;
				store?: { id: string };
			} = {
				isActive: true,
				$or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
			};

			if (storeId) {
				whereClause.store = { id: storeId };
			}

			const credentials = await this.options.em.find(
				ApiCredentialModel,
				whereClause,
				{
					populate: [
						"store",
						"createdByUser",
						"jwtToken",
						"oauth2Client",
						"transactions",
					],
				},
			);
			return credentials;
		};

	findExpiredCredentials: IApiCredentialRepository["findExpiredCredentials"] =
		async () => {
			const credentials = await this.options.em.find(
				ApiCredentialModel,
				{
					expiresAt: { $lt: new Date() },
					isActive: true,
				},
				{
					populate: [
						"store",
						"createdByUser",
						"jwtToken",
						"oauth2Client",
						"transactions",
					],
				},
			);
			return credentials;
		};

	findByStoreAndType: IApiCredentialRepository["findByStoreAndType"] = async (
		storeId,
		credentialType,
	) => {
		const credentials = await this.options.em.find(
			ApiCredentialModel,
			{
				store: { id: storeId },
				credentialType,
			},
			{
				populate: [
					"store",
					"createdByUser",
					"jwtToken",
					"oauth2Client",
					"transactions",
				],
			},
		);
		return credentials;
	};

	updateLastUsedAt: IApiCredentialRepository["updateLastUsedAt"] = async (
		id,
	) => {
		const credential = await this.options.em.findOne(ApiCredentialModel, {
			id,
		});
		if (!credential) {
			throw new Error(`ApiCredential with id ${id} not found`);
		}

		credential.lastUsedAt = new Date();
		await this.options.em.flush();
	};

	deactivateCredential: IApiCredentialRepository["deactivateCredential"] =
		async (id) => {
			const credential = await this.options.em.findOne(
				ApiCredentialModel,
				{ id },
				{
					populate: [
						"store",
						"createdByUser",
						"jwtToken",
						"oauth2Client",
						"transactions",
					],
				},
			);
			if (!credential) {
				throw new Error(`ApiCredential with id ${id} not found`);
			}

			credential.isActive = false;
			await this.options.em.flush();
			return credential;
		};

	create: IApiCredentialRepository["create"] = async (credentialData) => {
		const store = await this.options.em.findOne(StoreModel, {
			id: credentialData.storeId,
		});
		if (!store) {
			throw new Error(`Store with id ${credentialData.storeId} not found`);
		}

		const createdByUser = await this.options.em.findOne(UserModel, {
			id: credentialData.createdByUserId,
		});
		if (!createdByUser) {
			throw new Error(
				`User with id ${credentialData.createdByUserId} not found`,
			);
		}

		const credentialModel = new ApiCredentialModel({
			store,
			name: credentialData.name,
			credentialType: credentialData.credentialType,
			createdByUser,
			isActive: credentialData.isActive ?? true,
			expiresAt: credentialData.expiresAt ?? null,
			lastUsedAt: credentialData.lastUsedAt ?? null,
		});

		await this.options.em.persistAndFlush(credentialModel);
		return credentialModel;
	};

	update: IApiCredentialRepository["update"] = async (id, credentialData) => {
		const credential = await this.options.em.findOne(ApiCredentialModel, {
			id,
		});
		if (!credential) {
			throw new Error(`ApiCredential with id ${id} not found`);
		}

		if (credentialData.storeId !== undefined) {
			if (credentialData.storeId === null) {
				credential.store = null as unknown as StoreModel;
			} else {
				const store = await this.options.em.findOne(StoreModel, {
					id: credentialData.storeId,
				});
				if (store) {
					credential.store = store;
				}
			}
		}

		if (credentialData.createdByUserId !== undefined) {
			if (credentialData.createdByUserId === null) {
				credential.createdByUser = null as unknown as UserModel;
			} else {
				const user = await this.options.em.findOne(UserModel, {
					id: credentialData.createdByUserId,
				});
				if (user) {
					credential.createdByUser = user;
				}
			}
		}

		const { storeId, createdByUserId, ...updateData } = credentialData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(credential, filteredUpdateData);
		await this.options.em.flush();
		return credential;
	};

	delete: IApiCredentialRepository["delete"] = async (id) => {
		const credential = await this.options.em.findOne(ApiCredentialModel, {
			id,
		});
		if (!credential) {
			return;
		}

		await this.options.em.removeAndFlush(credential);
	};

	deleteByStoreId: IApiCredentialRepository["deleteByStoreId"] = async (
		storeId,
	) => {
		const credentials = await this.options.em.find(ApiCredentialModel, {
			store: { id: storeId },
		});

		if (credentials.length > 0) {
			await this.options.em.removeAndFlush(credentials);
		}
	};
}
