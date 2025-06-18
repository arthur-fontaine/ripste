import type { FilterQuery } from "@mikro-orm/core";
import type { IOAuth2ClientRepository } from "../../domain/ports/IOAuth2ClientRepository.ts";
import type { IOAuth2Client } from "../../domain/models/IOAuth2Client.ts";
import { Oauth2ClientModel } from "./models/Oauth2ClientModel.ts";
import { ApiCredentialModel } from "./models/ApiCredentialModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

const POPULATE_FIELDS = ["credential"] as const;

export class MikroormOauth2ClientRepository implements IOAuth2ClientRepository {
	private options: RepoUtils.IMikroormRepositoryOptions;

	constructor(options: RepoUtils.IMikroormRepositoryOptions) {
		this.options = options;
	}

	findById: IOAuth2ClientRepository["findById"] = async (id) => {
		return RepoUtils.findById<IOAuth2Client, Oauth2ClientModel>(
			this.options.em,
			Oauth2ClientModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: IOAuth2ClientRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<Oauth2ClientModel> = {};

		if (params.credentialId)
			whereClause.credential = { id: params.credentialId };

		if (params.clientId) whereClause.clientId = params.clientId;

		return RepoUtils.findMany<IOAuth2Client, Oauth2ClientModel>(
			this.options.em,
			Oauth2ClientModel,
			whereClause,
			POPULATE_FIELDS,
		);
	};

	create: IOAuth2ClientRepository["create"] = async (clientData) => {
		const credential = await RepoUtils.findRelatedEntity(
			this.options.em,
			ApiCredentialModel,
			clientData.credentialId,
			"ApiCredential",
		);

		const clientModel = new Oauth2ClientModel({
			clientId: clientData.clientId,
			clientSecretHash: clientData.clientSecretHash,
			redirectUris: clientData.redirectUris,
			scopes: clientData.scopes,
			credential: credential,
		});

		await this.options.em.persistAndFlush(clientModel);
		return clientModel;
	};

	update: IOAuth2ClientRepository["update"] = async (id, clientData) => {
		const updateData: Record<string, unknown> = {};

		if (clientData.credentialId !== undefined) {
			const credential = await RepoUtils.findRelatedEntity(
				this.options.em,
				ApiCredentialModel,
				clientData.credentialId,
				"ApiCredential",
			);
			updateData["credential"] = credential;
		}

		const { credentialId, ...otherData } = clientData;
		Object.assign(updateData, RepoUtils.filterUpdateData(otherData));

		return RepoUtils.updateEntity<IOAuth2Client, Oauth2ClientModel>(
			this.options.em,
			Oauth2ClientModel,
			id,
			updateData,
			POPULATE_FIELDS,
		);
	};

	delete: IOAuth2ClientRepository["delete"] = async (id) => {
		await RepoUtils.deleteEntity(this.options.em, Oauth2ClientModel, id);
	};

	deleteByCredentialId: IOAuth2ClientRepository["deleteByCredentialId"] =
		async (credentialId) => {
			const client = await this.options.em.findOne(Oauth2ClientModel, {
				credential: { id: credentialId },
				deletedAt: null,
			});
			if (!client) {
				return;
			}

			client.deletedAt = new Date();
			await this.options.em.flush();
		};
}
