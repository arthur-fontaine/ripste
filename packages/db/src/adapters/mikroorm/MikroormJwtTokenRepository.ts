import type { EntityManager } from "@mikro-orm/core";
import type { IJwtTokenRepository } from "../../domain/ports/IJwtTokenRepository.ts";
import type { IJwtToken } from "../../domain/models/IJwtToken.ts";
import { JwtTokenModel } from "./models/JwtTokenModel.ts";
import { ApiCredentialModel } from "./models/ApiCredentialModel.ts";

interface IMikroormJwtTokenRepositoryOptions {
	em: EntityManager;
}

export class MikroormJwtTokenRepository implements IJwtTokenRepository {
	private options: IMikroormJwtTokenRepositoryOptions;

	constructor(options: IMikroormJwtTokenRepositoryOptions) {
		this.options = options;
	}

	findById: IJwtTokenRepository["findById"] = async (id) => {
		const token = await this.options.em.findOne(
			JwtTokenModel,
			{ 
				id,
				deletedAt: null,
			},
			{
				populate: ["credential"],
			},
		);
		return token;
	};

	findMany: IJwtTokenRepository["findMany"] = async (params) => {
		interface WhereClause {
			credential?: { id: string };
			tokenHash?: string;
			deletedAt: null;
		}

		const whereClause: WhereClause = {
			deletedAt: null,
		};

		if (params.credentialId) {
			whereClause.credential = { id: params.credentialId };
		}

		if (params.tokenHash) {
			whereClause.tokenHash = params.tokenHash;
		}

		const tokens = await this.options.em.find(JwtTokenModel, whereClause, {
			populate: ["credential"],
		});
		return tokens;
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
			const credential = await this.options.em.findOne(ApiCredentialModel, {
				id: tokenData.credentialId,
			});
			if (!credential) {
				throw new Error(
					`ApiCredential with id ${tokenData.credentialId} not found`,
				);
			}
			token.credential = credential;
		}

		const { credentialId, ...updateData } = tokenData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(token, filteredUpdateData);
		await this.options.em.flush();
		return token as IJwtToken;
	};

	delete: IJwtTokenRepository["delete"] = async (id) => {
		const token = await this.options.em.findOne(JwtTokenModel, { 
			id,
			deletedAt: null,
		});
		if (!token) {
			return;
		}

		token.deletedAt = new Date();
		await this.options.em.flush();
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
