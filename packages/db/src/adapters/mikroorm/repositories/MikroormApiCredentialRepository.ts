import type { EntityManager, FilterQuery } from "@mikro-orm/core";
import type { IApiCredentialRepository } from "../../../domain/ports/IApiCredentialRepository.ts";
import { ApiCredentialModel } from "../models/ApiCredentialModel.ts";
import { StoreModel } from "../models/StoreModel.ts";
import { UserModel } from "../models/UserModel.ts";
import type { IApiCredential } from "../../../domain/models/IApiCredential.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

interface IMikroormApiCredentialRepositoryOptions {
	em: EntityManager;
}

const POPULATE_FIELDS = [
	"store",
	"createdByUser",
	"jwtToken",
	"oauth2Client",
	"transactions",
] as const;

export class MikroormApiCredentialRepository
	implements IApiCredentialRepository
{
	private options: IMikroormApiCredentialRepositoryOptions;

	constructor(options: IMikroormApiCredentialRepositoryOptions) {
		this.options = options;
	}

	findById: IApiCredentialRepository["findById"] = async (id) => {
		return RepoUtils.findById<IApiCredential, ApiCredentialModel>(
			this.options.em,
			ApiCredentialModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: IApiCredentialRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<ApiCredentialModel> = {};

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

		return RepoUtils.findMany<IApiCredential, ApiCredentialModel>(
			this.options.em,
			ApiCredentialModel,
			whereClause,
			POPULATE_FIELDS,
		);
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
			const credential = await RepoUtils.findById<
				IApiCredential,
				ApiCredentialModel
			>(this.options.em, ApiCredentialModel, id, POPULATE_FIELDS);
			if (!credential) {
				throw new Error(`ApiCredential with id ${id} not found`);
			}

			credential.isActive = false;
			await this.options.em.flush();
			return credential;
		};

	create: IApiCredentialRepository["create"] = async (credentialData) => {
		const store = credentialData.storeId === null ? null : await RepoUtils.findRelatedEntity(
			this.options.em,
			StoreModel,
			credentialData.storeId,
			"Store",
		);

		if (!credentialData.createdByUserId) {
			throw new Error("createdByUserId is required for creating ApiCredential");
		}

		const createdByUser = await RepoUtils.findRelatedEntity(
			this.options.em,
			UserModel,
			credentialData.createdByUserId,
			"User",
		);

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

		if (!credentialData.createdByUserId) {
			throw new Error("createdByUserId cannot be null");
		}

		if (credentialData.storeId) {
			const store = await RepoUtils.findRelatedEntity(
				this.options.em,
				StoreModel,
				credentialData.storeId,
				"Store",
			);
			credential.store = store;
		} else if (credential.storeId === null) {
			credential.store = null;
		}

		const user = await RepoUtils.findRelatedEntity(
			this.options.em,
			UserModel,
			credentialData.createdByUserId,
			"User",
		);
		credential.createdByUser = user;

		const { storeId, createdByUserId, ...updateData } = credentialData;
		const filteredUpdateData = RepoUtils.filterUpdateData(updateData);

		this.options.em.assign(credential, filteredUpdateData);
		await this.options.em.flush();
		return credential;
	};

	delete: IApiCredentialRepository["delete"] = async (id) => {
		return RepoUtils.deleteEntity<IApiCredential, ApiCredentialModel>(
			this.options.em,
			ApiCredentialModel,
			id,
		);
	};
}
