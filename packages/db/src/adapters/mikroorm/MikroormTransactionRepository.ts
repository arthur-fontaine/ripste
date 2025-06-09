import type { EntityManager } from "@mikro-orm/core";
import type { ITransactionRepository } from "../../domain/ports/ITransactionRepository.ts";
import type { ITransaction } from "../../domain/models/ITransaction.ts";
import { TransactionModel } from "./models/TransactionModel.ts";
import { StoreModel } from "./models/StoreModel.ts";
import { ApiCredentialModel } from "./models/ApiCredentialModel.ts";

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
			{ id },
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

	findByReference: ITransactionRepository["findByReference"] = async (
		reference,
	) => {
		const transaction = await this.options.em.findOne(
			TransactionModel,
			{ reference },
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

	findByStoreId: ITransactionRepository["findByStoreId"] = async (
		storeId,
		options,
	) => {
		const transactions = await this.options.em.find(
			TransactionModel,
			{
				store: { id: storeId },
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
				...(options?.limit && { limit: options.limit }),
			},
		);
		return transactions;
	};

	create: ITransactionRepository["create"] = async (transactionData) => {
		let store: StoreModel | null = null;
		if (transactionData.storeId) {
			store = await this.options.em.findOne(StoreModel, {
				id: transactionData.storeId,
			});
			if (!store) {
				throw new Error(`Store with id ${transactionData.storeId} not found`);
			}
		}

		let apiCredential: ApiCredentialModel | null = null;
		if (transactionData.apiCredentialId) {
			apiCredential = await this.options.em.findOne(ApiCredentialModel, {
				id: transactionData.apiCredentialId,
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
		const transaction = await this.options.em.findOne(TransactionModel, { id });
		if (!transaction) {
			throw new Error(`Transaction with id ${id} not found`);
		}

		if (transactionData.storeId !== undefined) {
			if (transactionData.storeId === null) {
				transaction.store = null;
			} else {
				const store = await this.options.em.findOne(StoreModel, {
					id: transactionData.storeId,
				});
				if (!store) {
					throw new Error(`Store with id ${transactionData.storeId} not found`);
				}
				transaction.store = store;
			}
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
		const transaction = await this.options.em.findOne(TransactionModel, { id });
		if (!transaction) {
			return;
		}

		await this.options.em.removeAndFlush(transaction);
	};
}
