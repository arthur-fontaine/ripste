import type { EntityManager } from "@mikro-orm/core";
import type { ITransactionRepository } from "../../domain/ports/ITransactionRepository.ts";
import type { ITransaction } from "../../domain/models/ITransaction.ts";
import type { ITransactionEvent } from "../../domain/models/ITransactionEvent.ts";
import { TransactionModel } from "./models/TransactionModel.ts";
import { StoreModel } from "./models/StoreModel.ts";
import { ApiCredentialModel } from "./models/ApiCredentialModel.ts";
import { TransactionEventModel } from "./models/TransactionEventModel.ts";

interface IMikroormTransactionRepositoryOptions {
	em: EntityManager;
}

export class MikroormTransactionRepository implements ITransactionRepository {
	private options: IMikroormTransactionRepositoryOptions;

	constructor(options: IMikroormTransactionRepositoryOptions) {
		this.options = options;
	}

	findById: ITransactionRepository["findById"] = async (id) => {
		const transaction = await this.options.em.findOne(
			TransactionModel,
			{ 
				id,
				deletedAt: null,
			},
			{
				populate: [
					"store",
					"apiCredential",
					"transactionEvents",
					"paymentMethods",
					"checkoutPages",
					"paymentAttempts",
					"refunds",
				],
			},
		);
		return transaction;
	};

	findMany: ITransactionRepository["findMany"] = async (params) => {
		interface WhereClause {
			store?: { id: string };
			reference?: string;
			deletedAt: null;
		}

		const whereClause: WhereClause = {
			deletedAt: null,
		};

		if (params.storeId) {
			whereClause.store = { id: params.storeId };
		}

		if (params.reference) {
			whereClause.reference = params.reference;
		}

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
		const store = await this.options.em.findOne(StoreModel, {
			id: transactionData.storeId,
			deletedAt: null,
		});
		if (!store) {
			throw new Error(`Store with id ${transactionData.storeId} not found`);
		}

		let apiCredential: ApiCredentialModel | null = null;
		if (transactionData.apiCredentialId) {
			apiCredential = await this.options.em.findOne(ApiCredentialModel, {
				id: transactionData.apiCredentialId,
				deletedAt: null,
			});
			if (!apiCredential) {
				throw new Error(
					`ApiCredential with id ${transactionData.apiCredentialId} not found`,
				);
			}
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
		const transaction = await this.options.em.findOne(TransactionModel, {
			id,
			deletedAt: null,
		});
		if (!transaction) {
			throw new Error(`Transaction with id ${id} not found`);
		}

		if (transactionData.storeId !== undefined) {
			const store = await this.options.em.findOne(StoreModel, {
				id: transactionData.storeId,
				deletedAt: null,
			});
			if (!store) {
				throw new Error(`Store with id ${transactionData.storeId} not found`);
			}
			transaction.store = store;
		}

		if (transactionData.apiCredentialId !== undefined) {
			if (transactionData.apiCredentialId === null) {
				transaction.apiCredential = null;
				transaction.apiCredentialId = null;
			} else {
				const apiCredential = await this.options.em.findOne(
					ApiCredentialModel,
					{
						id: transactionData.apiCredentialId,
						deletedAt: null,
					},
				);
				if (!apiCredential) {
					throw new Error(
						`ApiCredential with id ${transactionData.apiCredentialId} not found`,
					);
				}
				transaction.apiCredential = apiCredential;
				transaction.apiCredentialId = transactionData.apiCredentialId;
			}
		}

		const { storeId, apiCredentialId, paymentMethodId, ...updateData } =
			transactionData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(transaction, filteredUpdateData);
		await this.options.em.flush();
		return transaction as ITransaction;
	};

	delete: ITransactionRepository["delete"] = async (id) => {
		const transaction = await this.options.em.findOne(TransactionModel, { 
			id,
			deletedAt: null,
		});
		if (!transaction) {
			return;
		}

		transaction.deletedAt = new Date();
		await this.options.em.flush();
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
		interface WhereClause {
			transaction?: { id: string };
			eventType?: string;
			deletedAt?: null;
			createdAt?: { $gte?: Date; $lte?: Date };
			$or?: Array<{ eventType: string }>;
		}

		const whereClause: WhereClause = {
			deletedAt: null,
		};

		if (params.transactionId) {
			whereClause.transaction = { id: params.transactionId };
		}

		if (params.eventType) {
			whereClause.eventType = params.eventType;
		}

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
