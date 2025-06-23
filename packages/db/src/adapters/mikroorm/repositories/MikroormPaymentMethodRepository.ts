import type { EntityManager, FilterQuery } from "@mikro-orm/core";
import type { IPaymentMethodRepository } from "../../../domain/ports/IPaymentMethodRepository.ts";
import type { IPaymentMethod } from "../../../domain/models/IPaymentMethod.ts";
import { PaymentMethodModel } from "../models/PaymentMethodModel.ts";
import { TransactionModel } from "../models/TransactionModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

const POPULATE_FIELDS = ["transaction", "paymentAttempts"] as const;

interface IMikroormPaymentMethodRepositoryOptions {
	em: EntityManager;
}

export class MikroormPaymentMethodRepository
	implements IPaymentMethodRepository
{
	private options: IMikroormPaymentMethodRepositoryOptions;

	constructor(options: IMikroormPaymentMethodRepositoryOptions) {
		this.options = options;
	}

	findById: IPaymentMethodRepository["findById"] = async (id) => {
		return RepoUtils.findById<IPaymentMethod, PaymentMethodModel>(
			this.options.em,
			PaymentMethodModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: IPaymentMethodRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<PaymentMethodModel> = {};

		if (params.transactionId)
			whereClause["transaction"] = { id: params.transactionId };
		if (params.methodType) whereClause["methodType"] = params.methodType;

		return RepoUtils.findMany<IPaymentMethod, PaymentMethodModel>(
			this.options.em,
			PaymentMethodModel,
			whereClause,
			POPULATE_FIELDS,
		);
	};

	create: IPaymentMethodRepository["create"] = async (methodData) => {
		const transaction = await RepoUtils.findRelatedEntity(
			this.options.em,
			TransactionModel,
			methodData.transactionId,
			"Transaction",
		);

		const paymentMethodModel = new PaymentMethodModel({
			methodType: methodData.methodType,
			methodData: methodData.methodData,
			transaction: transaction,
		});

		await this.options.em.persistAndFlush(paymentMethodModel);
		return paymentMethodModel;
	};

	update: IPaymentMethodRepository["update"] = async (id, methodData) => {
		const paymentMethod = await this.options.em.findOne(PaymentMethodModel, {
			id,
			deletedAt: null,
		});
		if (!paymentMethod) {
			throw new Error(`PaymentMethod with id ${id} not found`);
		}

		if (methodData.transactionId !== undefined) {
			const transaction = await RepoUtils.findRelatedEntity(
				this.options.em,
				TransactionModel,
				methodData.transactionId,
				"Transaction",
			);
			paymentMethod.transaction = transaction;
		}

		const { transactionId, ...updateData } = methodData;
		const filteredUpdateData = RepoUtils.filterUpdateData(updateData);

		this.options.em.assign(paymentMethod, filteredUpdateData);
		await this.options.em.flush();
		return paymentMethod as IPaymentMethod;
	};

	delete: IPaymentMethodRepository["delete"] = async (id) => {
		return RepoUtils.deleteEntity<IPaymentMethod, PaymentMethodModel>(
			this.options.em,
			PaymentMethodModel,
			id,
		);
	};

	deleteByTransactionId: IPaymentMethodRepository["deleteByTransactionId"] =
		async (transactionId) => {
			const paymentMethods = await this.options.em.find(PaymentMethodModel, {
				transaction: { id: transactionId },
				deletedAt: null,
			});

			if (paymentMethods.length > 0) {
				for (const paymentMethod of paymentMethods) {
					paymentMethod.deletedAt = new Date();
				}
				await this.options.em.flush();
			}
		};
}
