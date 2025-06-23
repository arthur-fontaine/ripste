import type { EntityManager, FilterQuery } from "@mikro-orm/core";
import type { IJwtTokenRepository } from "../../../domain/ports/IJwtTokenRepository.ts";
import type { IJwtToken } from "../../../domain/models/IJwtToken.ts";
import { JwtTokenModel } from "../models/JwtTokenModel.ts";
import { ApiCredentialModel } from "../models/ApiCredentialModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

interface IMikroormJwtTokenRepositoryOptions {
	em: EntityManager;
}

const POPULATE_FIELDS = ["credential"] as const;

export class MikroormJwtTokenRepository implements IJwtTokenRepository {
	private options: IMikroormJwtTokenRepositoryOptions;

	constructor(options: IMikroormJwtTokenRepositoryOptions) {
		this.options = options;
	}

	findById: IJwtTokenRepository["findById"] = async (id) => {
		return RepoUtils.findById<IJwtToken, JwtTokenModel>(
			this.options.em,
			JwtTokenModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: IJwtTokenRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<JwtTokenModel> = {};

		if (params.credentialId)
			whereClause.credential = { id: params.credentialId };
		if (params.tokenHash) whereClause.tokenHash = params.tokenHash;

		return RepoUtils.findMany<IJwtToken, JwtTokenModel>(
			this.options.em,
			JwtTokenModel,
			whereClause,
			POPULATE_FIELDS,
		);
	};

	create: IJwtTokenRepository["create"] = async (tokenData) => {
		const credential = await this.options.em.findOne(ApiCredentialModel, {
			id: tokenData.credentialId,
		});
		if (!credential) {
			throw new Error(
				`ApiCredential with id ${tokenData.credentialId} not found`,
			);
		}

		const tokenModel = new JwtTokenModel({
			tokenHash: tokenData.tokenHash,
			permissions: tokenData.permissions,
			credential: credential,
		});

		await this.options.em.persistAndFlush(tokenModel);
		return tokenModel;
	};

	update: IJwtTokenRepository["update"] = async (id, tokenData) => {
		const token = await this.options.em.findOne(JwtTokenModel, {
			id,
			deletedAt: null,
		});
		if (!token) {
			throw new Error(`JwtToken with id ${id} not found`);
		}

		if (tokenData.credentialId !== undefined) {
			const credential = await RepoUtils.findRelatedEntity(
				this.options.em,
				ApiCredentialModel,
				tokenData.credentialId,
				"ApiCredential",
			);
			token.credential = credential;
		}

		const { credentialId, ...updateData } = tokenData;
		const filteredUpdateData = RepoUtils.filterUpdateData(updateData);

		this.options.em.assign(token, filteredUpdateData);
		await this.options.em.flush();
		return token as IJwtToken;
	};

	delete: IJwtTokenRepository["delete"] = async (id) => {
		return RepoUtils.deleteEntity<IJwtToken, JwtTokenModel>(
			this.options.em,
			JwtTokenModel,
			id,
		);
	};

	deleteByCredentialId: IJwtTokenRepository["deleteByCredentialId"] = async (
		credentialId,
	) => {
		const token = await this.options.em.findOne(JwtTokenModel, {
			credential: { id: credentialId },
			deletedAt: null,
		});
		if (!token) {
			return;
		}

		token.deletedAt = new Date();
		await this.options.em.flush();
	};
}
