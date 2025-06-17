import type { EntityManager } from "@mikro-orm/core";
import type { IOAuth2ClientRepository } from "../../domain/ports/IOAuth2ClientRepository.ts";
import type { IOAuth2Client } from "../../domain/models/IOAuth2Client.ts";
import { Oauth2ClientModel } from "./models/Oauth2ClientModel.ts";
import { ApiCredentialModel } from "./models/ApiCredentialModel.ts";

interface IMikroormOauth2ClientRepositoryOptions {
	em: EntityManager;
}

export class MikroormOauth2ClientRepository implements IOAuth2ClientRepository {
	private options: IMikroormOauth2ClientRepositoryOptions;

	constructor(options: IMikroormOauth2ClientRepositoryOptions) {
		this.options = options;
	}

	findById: IOAuth2ClientRepository["findById"] = async (id) => {
		const client = await this.options.em.findOne(
			Oauth2ClientModel,
			{ id },
			{
				populate: ["credential"],
			},
		);
		return client;
	};

	findMany: IOAuth2ClientRepository["findMany"] = async (params) => {
		interface WhereClause {
			credential?: { id: string };
			clientId?: string;
		}

		const whereClause: WhereClause = {};

		if (params.credentialId) {
			whereClause.credential = { id: params.credentialId };
		}

		if (params.clientId) {
			whereClause.clientId = params.clientId;
		}

		const clients = await this.options.em.find(Oauth2ClientModel, whereClause, {
			populate: ["credential"],
		});
		return clients;
	};

	create: IOAuth2ClientRepository["create"] = async (clientData) => {
		let credential: ApiCredentialModel | null = null;
		if (clientData.credentialId) {
			credential = await this.options.em.findOne(ApiCredentialModel, {
				id: clientData.credentialId,
			});
			if (!credential) {
				throw new Error(
					`ApiCredential with id ${clientData.credentialId} not found`,
				);
			}
		}

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
		const client = await this.options.em.findOne(Oauth2ClientModel, { id });
		if (!client) {
			throw new Error(`OAuth2Client with id ${id} not found`);
		}

		if (clientData.credentialId !== undefined) {
			if (clientData.credentialId === null) {
				client.credential = null;
			} else {
				const credential = await this.options.em.findOne(ApiCredentialModel, {
					id: clientData.credentialId,
				});
				if (!credential) {
					throw new Error(
						`ApiCredential with id ${clientData.credentialId} not found`,
					);
				}
				client.credential = credential;
			}
		}

		const { credentialId, ...updateData } = clientData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(client, filteredUpdateData);
		await this.options.em.flush();
		return client as IOAuth2Client;
	};

	delete: IOAuth2ClientRepository["delete"] = async (id) => {
		const client = await this.options.em.findOne(Oauth2ClientModel, { id });
		if (!client) {
			return;
		}

		await this.options.em.removeAndFlush(client);
	};

	deleteByCredentialId: IOAuth2ClientRepository["deleteByCredentialId"] =
		async (credentialId) => {
			const client = await this.options.em.findOne(Oauth2ClientModel, {
				credential: { id: credentialId },
			});
			if (!client) {
				return;
			}

			await this.options.em.removeAndFlush(client);
		};
}
