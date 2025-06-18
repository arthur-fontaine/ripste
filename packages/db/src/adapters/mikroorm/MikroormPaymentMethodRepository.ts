import type { EntityManager } from "@mikro-orm/core";
import type { IPaymentMethodRepository } from "../../domain/ports/IPaymentMethodRepository.ts";
import type { IPaymentMethod } from "../../domain/models/IPaymentMethod.ts";
import { PaymentMethodModel } from "./models/PaymentMethodModel.ts";
import { TransactionModel } from "./models/TransactionModel.ts";

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
		const paymentMethod = await this.options.em.findOne(
			PaymentMethodModel,
			{
				id,
				deletedAt: null,
			},
			{
				populate: ["transaction", "paymentAttempts"],
			},
		);
		return paymentMethod;
	};

	findMany: IPaymentMethodRepository["findMany"] = async (params) => {
		const whereClause: Record<string, unknown> = {
			deletedAt: null,
		};

		if (params.transactionId)
			whereClause["transaction"] = { id: params.transactionId };

		if (params.methodType) whereClause["methodType"] = params.methodType;

		const paymentMethods = await this.options.em.find(
			PaymentMethodModel,
			whereClause,
			{
				populate: ["transaction", "paymentAttempts"],
				orderBy: { createdAt: "DESC" },
			},
		);
		return paymentMethods;
	};

	create: IPaymentMethodRepository["create"] = async (methodData) => {
		const transaction = await this.options.em.findOne(TransactionModel, {
			deletedAt: null,
			id: methodData.transactionId,
		});
		if (!transaction) {
			throw new Error(
				`Transaction with id ${methodData.transactionId} not found`,
			);
		}

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
			const transaction = await this.options.em.findOne(TransactionModel, {
				deletedAt: null,
				id: methodData.transactionId,
			});
			if (!transaction) {
				throw new Error(
					`Transaction with id ${methodData.transactionId} not found`,
				);
			}
			paymentMethod.transaction = transaction;
		}

		const { transactionId, ...updateData } = methodData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(paymentMethod, filteredUpdateData);
		await this.options.em.flush();
		return paymentMethod as IPaymentMethod;
	};

	delete: IPaymentMethodRepository["delete"] = async (id) => {
		const paymentMethod = await this.options.em.findOne(PaymentMethodModel, {
			id,
			deletedAt: null,
		});
		if (!paymentMethod) {
			return;
		}

		paymentMethod.deletedAt = new Date();
		await this.options.em.flush();
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
