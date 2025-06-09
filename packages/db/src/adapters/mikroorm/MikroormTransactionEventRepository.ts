import type { EntityManager } from "@mikro-orm/core";
import type { ITransactionEventRepository } from "../../domain/ports/ITransactionEventRepository.ts";
import type { ITransactionEvent } from "../../domain/models/ITransactionEvent.ts";
import { TransactionEventModel } from "./models/TransactionEventModel.ts";
import { TransactionModel } from "./models/TransactionModel.ts";

interface IMikroormTransactionEventRepositoryOptions {
	em: EntityManager;
}

export class MikroormTransactionEventRepository
	implements ITransactionEventRepository
{
	private options: IMikroormTransactionEventRepositoryOptions;

	constructor(options: IMikroormTransactionEventRepositoryOptions) {
		this.options = options;
	}

	findById: ITransactionEventRepository["findById"] = async (id) => {
		const event = await this.options.em.findOne(
			TransactionEventModel,
			{ id },
			{
				populate: ["transaction"],
			},
		);
		return event;
	};

	findByTransactionId: ITransactionEventRepository["findByTransactionId"] =
		async (transactionId) => {
			const events = await this.options.em.find(
				TransactionEventModel,
				{
					transaction: { id: transactionId },
				},
				{
					populate: ["transaction"],
					orderBy: { occurredAt: "ASC" },
				},
			);
			return events;
		};

	findByEventType: ITransactionEventRepository["findByEventType"] = async (
		eventType,
	) => {
		const events = await this.options.em.find(
			TransactionEventModel,
			{ eventType },
			{
				populate: ["transaction"],
				orderBy: { occurredAt: "DESC" },
			},
		);
		return events;
	};

	findByTransactionAndEventType: ITransactionEventRepository["findByTransactionAndEventType"] =
		async (transactionId, eventType) => {
			const events = await this.options.em.find(
				TransactionEventModel,
				{
					transaction: { id: transactionId },
					eventType,
				},
				{
					populate: ["transaction"],
					orderBy: { occurredAt: "ASC" },
				},
			);
			return events;
		};

	findEventHistory: ITransactionEventRepository["findEventHistory"] = async (
		transactionId,
		options,
	) => {
		const whereClause: {
			transaction: { id: string };
			occurredAt?: { $gte?: Date; $lte?: Date };
		} = {
			transaction: { id: transactionId },
		};

		if (options?.fromDate || options?.toDate) {
			const dateFilter: { $gte?: Date; $lte?: Date } = {};
			if (options.fromDate) dateFilter.$gte = options.fromDate;
			if (options.toDate) dateFilter.$lte = options.toDate;
			whereClause.occurredAt = dateFilter;
		}

		const events = await this.options.em.find(
			TransactionEventModel,
			whereClause,
			{
				populate: ["transaction"],
				orderBy: { occurredAt: "ASC" },
				...(options?.limit && { limit: options.limit }),
			},
		);
		return events;
	};

	findRecentEvents: ITransactionEventRepository["findRecentEvents"] = async (
		options,
	) => {
		const whereClause: { eventType?: { $in: string[] } } = {};

		if (options?.eventTypes && options.eventTypes.length > 0) {
			whereClause.eventType = { $in: options.eventTypes };
		}

		const events = await this.options.em.find(
			TransactionEventModel,
			whereClause,
			{
				populate: ["transaction"],
				orderBy: { occurredAt: "DESC" },
				...(options?.limit && { limit: options.limit }),
			},
		);
		return events;
	};

	create: ITransactionEventRepository["create"] = async (eventData) => {
		let transaction: TransactionModel | null = null;
		if (eventData.transactionId) {
			transaction = await this.options.em.findOne(TransactionModel, {
				id: eventData.transactionId,
			});
			if (!transaction) {
				throw new Error(
					`Transaction with id ${eventData.transactionId} not found`,
				);
			}
		}

		const eventModel = new TransactionEventModel({
			eventType: eventData.eventType,
			eventData: eventData.eventData,
			occurredAt: eventData.occurredAt || new Date(),
			transaction: transaction,
		});

		await this.options.em.persistAndFlush(eventModel);
		return eventModel;
	};

	update: ITransactionEventRepository["update"] = async (id, eventData) => {
		const event = await this.options.em.findOne(TransactionEventModel, { id });
		if (!event) {
			throw new Error(`TransactionEvent with id ${id} not found`);
		}

		if (eventData.transactionId !== undefined) {
			if (eventData.transactionId === null) {
				event.transaction = null;
			} else {
				const transaction = await this.options.em.findOne(TransactionModel, {
					id: eventData.transactionId,
				});
				if (transaction) {
					event.transaction = transaction;
				}
			}
		}

		const { transactionId, ...updateData } = eventData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(event, filteredUpdateData);
		await this.options.em.flush();
		return event as ITransactionEvent;
	};

	delete: ITransactionEventRepository["delete"] = async (id) => {
		const event = await this.options.em.findOne(TransactionEventModel, { id });
		if (!event) {
			return;
		}

		await this.options.em.removeAndFlush(event);
	};

	deleteByTransactionId: ITransactionEventRepository["deleteByTransactionId"] =
		async (transactionId) => {
			const events = await this.options.em.find(TransactionEventModel, {
				transaction: { id: transactionId },
			});

			if (events.length > 0) {
				await this.options.em.removeAndFlush(events);
			}
		};
}
