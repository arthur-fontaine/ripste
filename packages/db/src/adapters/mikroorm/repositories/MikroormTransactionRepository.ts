import type { FilterQuery } from "@mikro-orm/core";
import type { ITransactionRepository } from "../../../domain/ports/ITransactionRepository.ts";
import type { ITransactionEvent } from "../../../domain/models/ITransactionEvent.ts";
import { TransactionModel } from "../models/TransactionModel.ts";
import { StoreModel } from "../models/StoreModel.ts";
import { ApiCredentialModel } from "../models/ApiCredentialModel.ts";
import { TransactionEventModel } from "../models/TransactionEventModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

const POPULATE_FIELDS = [
	"store",
	"apiCredential",
	"transactionEvents",
	"paymentMethods",
	"checkoutPages",
	"paymentAttempts",
	"refunds",
] as const;

export class MikroormTransactionRepository implements ITransactionRepository {
	private options: RepoUtils.IMikroormRepositoryOptions;

	constructor(options: RepoUtils.IMikroormRepositoryOptions) {
		this.options = options;
	}

	findById: ITransactionRepository["findById"] = async (id) => {
		return await RepoUtils.findById(
			this.options.em,
			TransactionModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: ITransactionRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<TransactionModel> = {
			deletedAt: null,
		};

		if (params.storeId) whereClause.store = { id: params.storeId };

		if (params.reference) whereClause.reference = params.reference;

		const options = {
			populate: [
				"store",
				"apiCredential",
				"transactionEvents",
				"paymentMethods",
				"checkoutPages",
				"paymentAttempts",
				"refunds",
			] as const,
			orderBy: { createdAt: "DESC" as const },
			...(params.limit && { limit: params.limit }),
		};

		const transactions = await this.options.em.find(
			TransactionModel,
			whereClause,
			options,
		);
		return transactions;
	};

	create: ITransactionRepository["create"] = async (transactionData) => {
		const store = await RepoUtils.findRelatedEntity(
			this.options.em,
			StoreModel,
			transactionData.storeId,
			"Store",
		);

		let apiCredential: ApiCredentialModel | null = null;
		if (transactionData.apiCredentialId) {
			apiCredential = await RepoUtils.findRelatedEntity(
				this.options.em,
				ApiCredentialModel,
				transactionData.apiCredentialId,
				"ApiCredential",
			);
		}

		const transactionModel = new TransactionModel({
			reference: transactionData.reference,
			amount: transactionData.amount,
			currency: transactionData.currency,
			status: transactionData.status,
			metadata: transactionData.metadata,
			store: store,
			apiCredential: apiCredential,
			apiCredentialId: transactionData.apiCredentialId,
		});

		await this.options.em.persistAndFlush(transactionModel);
		return transactionModel;
	};

	update: ITransactionRepository["update"] = async (id, transactionData) => {
		const updateData: Record<string, unknown> = {};

		if (transactionData.storeId !== undefined) {
			const store = await RepoUtils.findRelatedEntity(
				this.options.em,
				StoreModel,
				transactionData.storeId,
				"Store",
			);
			updateData["store"] = store;
		}

		if (transactionData.apiCredentialId !== undefined) {
			if (transactionData.apiCredentialId === null) {
				updateData["apiCredential"] = null;
				updateData["apiCredentialId"] = null;
			} else {
				const apiCredential = await RepoUtils.findRelatedEntity(
					this.options.em,
					ApiCredentialModel,
					transactionData.apiCredentialId,
					"ApiCredential",
				);
				updateData["apiCredential"] = apiCredential;
				updateData["apiCredentialId"] = transactionData.apiCredentialId;
			}
		}

		const { storeId, apiCredentialId, paymentMethodId, ...otherData } =
			transactionData;
		Object.assign(updateData, RepoUtils.filterUpdateData(otherData));

		return await RepoUtils.updateEntity(
			this.options.em,
			TransactionModel,
			id,
			updateData,
			POPULATE_FIELDS,
		);
	};

	delete: ITransactionRepository["delete"] = async (id) => {
		await RepoUtils.deleteEntity(this.options.em, TransactionModel, id);
	};

	recordEvent: ITransactionRepository["recordEvent"] = async (eventData) => {
		const transaction = await this.options.em.findOne(TransactionModel, {
			deletedAt: null,
			id: eventData.transactionId,
		});
		if (!transaction) {
			throw new Error(
				`Transaction with id ${eventData.transactionId} not found`,
			);
		}

		const eventModel = new TransactionEventModel({
			eventType: eventData.eventType,
			eventData: eventData.eventData,
			occurredAt: eventData.occurredAt,
			transaction,
		});

		await this.options.em.persistAndFlush(eventModel);
		return eventModel;
	};

	updateEvent: ITransactionRepository["updateEvent"] = async (
		id,
		eventData,
	) => {
		const transactionEvent = await this.options.em.findOne(
			TransactionEventModel,
			{ id },
		);
		if (!transactionEvent) {
			throw new Error(`TransactionEvent with id ${id} not found`);
		}

		if (eventData.transactionId !== undefined) {
			const transaction = await this.options.em.findOne(TransactionModel, {
				deletedAt: null,
				id: eventData.transactionId,
			});
			if (!transaction) {
				throw new Error(
					`Transaction with id ${eventData.transactionId} not found`,
				);
			}
			transactionEvent.transaction = transaction;
		}

		const { transactionId, ...updateData } = eventData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(transactionEvent, filteredUpdateData);
		await this.options.em.flush();
		return transactionEvent as ITransactionEvent;
	};

	getEvents: ITransactionRepository["getEvents"] = async (params) => {
		const whereClause: FilterQuery<TransactionEventModel> = {
			deletedAt: null,
		};

		if (params.transactionId)
			whereClause.transaction = { id: params.transactionId };

		if (params.eventType) whereClause.eventType = params.eventType;

		if (params.eventTypes && params.eventTypes.length > 0) {
			whereClause.$or = params.eventTypes.map((eventType) => ({ eventType }));
		}

		if (params.fromDate || params.toDate) {
			whereClause.createdAt = {};
			if (params.fromDate) {
				whereClause.createdAt.$gte = params.fromDate;
			}
			if (params.toDate) {
				whereClause.createdAt.$lte = params.toDate;
			}
		}

		const options = {
			populate: ["transaction"] as const,
			orderBy: { createdAt: "DESC" as const },
			...(params.limit && { limit: params.limit }),
		};

		const events = await this.options.em.find(
			TransactionEventModel,
			whereClause,
			options,
		);
		return events;
	};

	findEventById: ITransactionRepository["findEventById"] = async (id) => {
		const transactionEvent = await this.options.em.findOne(
			TransactionEventModel,
			{
				id,
				deletedAt: null,
			},
			{
				populate: ["transaction"],
			},
		);
		return transactionEvent;
	};

	deleteEvent: ITransactionRepository["deleteEvent"] = async (id) => {
		const transactionEvent = await this.options.em.findOne(
			TransactionEventModel,
			{
				id,
				deletedAt: null,
			},
		);
		if (!transactionEvent) {
			return;
		}

		transactionEvent.deletedAt = new Date();
		await this.options.em.flush();
	};

	deleteEventsByTransactionId: ITransactionRepository["deleteEventsByTransactionId"] =
		async (transactionId) => {
			const events = await this.options.em.find(TransactionEventModel, {
				transaction: { id: transactionId },
				deletedAt: null,
			});

			if (events.length > 0) {
				for (const event of events) {
					event.deletedAt = new Date();
				}
				await this.options.em.flush();
			}
		};
}
