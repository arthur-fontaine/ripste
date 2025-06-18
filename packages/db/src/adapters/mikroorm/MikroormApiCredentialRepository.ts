import type { EntityManager, FilterQuery } from "@mikro-orm/core";
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
			{ id, deletedAt: null },
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

	findMany: IApiCredentialRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<ApiCredentialModel> = {
			deletedAt: null,
		};

		if (params.storeId) whereClause.store = { id: params.storeId };

		if (params.userId) whereClause.createdByUser = { id: params.userId };

		if (params.credentialType)
			whereClause.credentialType = params.credentialType;

		if (params.active !== undefined) {
			if (params.active) {
				whereClause.isActive = true;
				whereClause.$or = [
					{ expiresAt: null },
					{ expiresAt: { $gt: new Date() } },
				];
			} else {
				whereClause.isActive = false;
			}
		}

		if (params.expired !== undefined) {
			if (params.expired) {
				whereClause.expiresAt = { $lt: new Date() };
				whereClause.isActive = true;
			} else {
				whereClause.$or = [
					{ expiresAt: null },
					{ expiresAt: { $gt: new Date() } },
				];
			}
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

	updateLastUsedAt: IApiCredentialRepository["updateLastUsedAt"] = async (
		id,
	) => {
		const credential = await this.options.em.findOne(ApiCredentialModel, {
			id,
			deletedAt: null,
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
				{ id, deletedAt: null },
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
			deletedAt: null,
		});
		if (!store) {
			throw new Error(`Store with id ${credentialData.storeId} not found`);
		}

		const createdByUser = await this.options.em.findOne(UserModel, {
			id: credentialData.createdByUserId,
			deletedAt: null,
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
			deletedAt: null,
		});
		if (!credential) {
			throw new Error(`ApiCredential with id ${id} not found`);
		}

		if (credentialData.storeId === undefined) {
			throw new Error("storeId is required for updating ApiCredential");
		}

		if (credentialData.createdByUserId === undefined) {
			throw new Error("createdByUserId is required for updating ApiCredential");
		}

		const store = await this.options.em.findOne(StoreModel, {
			id: credentialData.storeId,
			deletedAt: null,
		});
		if (!store) {
			throw new Error(`Store with id ${credentialData.storeId} not found`);
		}
		credential.store = store;

		const user = await this.options.em.findOne(UserModel, {
			id: credentialData.createdByUserId,
			deletedAt: null,
		});
		if (!user) {
			throw new Error(
				`User with id ${credentialData.createdByUserId} not found`,
			);
		}
		credential.createdByUser = user;

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
			deletedAt: null,
		});
		if (!credential) {
			return;
		}

		// Soft delete by setting deletedAt timestamp
		credential.deletedAt = new Date();
		await this.options.em.flush();
	};
}
