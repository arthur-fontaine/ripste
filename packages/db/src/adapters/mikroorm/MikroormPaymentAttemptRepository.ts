import type { EntityManager } from "@mikro-orm/core";
import type { IPaymentAttemptRepository } from "../../domain/ports/IPaymentAttemptRepository.ts";
import type { IPaymentAttempt } from "../../domain/models/IPaymentAttempt.ts";
import { PaymentAttemptModel } from "./models/PaymentAttemptModel.ts";
import { TransactionModel } from "./models/TransactionModel.ts";
import { PaymentMethodModel } from "./models/PaymentMethodModel.ts";

interface IMikroormPaymentAttemptRepositoryOptions {
	em: EntityManager;
}

export class MikroormPaymentAttemptRepository
	implements IPaymentAttemptRepository
{
	private options: IMikroormPaymentAttemptRepositoryOptions;

	constructor(options: IMikroormPaymentAttemptRepositoryOptions) {
		this.options = options;
	}

	findById: IPaymentAttemptRepository["findById"] = async (id) => {
		const attempt = await this.options.em.findOne(
			PaymentAttemptModel,
			{ id },
			{
				populate: ["transaction", "paymentMethod"],
			},
		);
		return attempt;
	};

	findByTransactionId: IPaymentAttemptRepository["findByTransactionId"] =
		async (transactionId) => {
			const attempts = await this.options.em.find(
				PaymentAttemptModel,
				{
					transaction: { id: transactionId },
				},
				{
					populate: ["transaction", "paymentMethod"],
					orderBy: { attemptedAt: "DESC" },
				},
			);
			return attempts;
		};

	findByPaymentMethodId: IPaymentAttemptRepository["findByPaymentMethodId"] =
		async (paymentMethodId) => {
			const attempts = await this.options.em.find(
				PaymentAttemptModel,
				{
					paymentMethod: { id: paymentMethodId },
				},
				{
					populate: ["transaction", "paymentMethod"],
					orderBy: { attemptedAt: "DESC" },
				},
			);
			return attempts;
		};

	findByTransactionAndMethod: IPaymentAttemptRepository["findByTransactionAndMethod"] =
		async (transactionId, paymentMethodId) => {
			const attempts = await this.options.em.find(
				PaymentAttemptModel,
				{
					transaction: { id: transactionId },
					paymentMethod: { id: paymentMethodId },
				},
				{
					populate: ["transaction", "paymentMethod"],
					orderBy: { attemptedAt: "ASC" },
				},
			);
			return attempts;
		};

	findByStatus: IPaymentAttemptRepository["findByStatus"] = async (status) => {
		const attempts = await this.options.em.find(
			PaymentAttemptModel,
			{ status },
			{
				populate: ["transaction", "paymentMethod"],
				orderBy: { attemptedAt: "DESC" },
			},
		);
		return attempts;
	};

	findByCustomerIp: IPaymentAttemptRepository["findByCustomerIp"] = async (
		customerIp,
	) => {
		const attempts = await this.options.em.find(
			PaymentAttemptModel,
			{ customerIp },
			{
				populate: ["transaction", "paymentMethod"],
				orderBy: { attemptedAt: "DESC" },
			},
		);
		return attempts;
	};

	create: IPaymentAttemptRepository["create"] = async (attemptData) => {
		const transaction = await this.options.em.findOne(TransactionModel, {
			id: attemptData.transactionId,
		});
		if (!transaction) {
			throw new Error(
				`Transaction with id ${attemptData.transactionId} not found`,
			);
		}

		const paymentMethod = await this.options.em.findOne(PaymentMethodModel, {
			id: attemptData.paymentMethodId,
		});
		if (!paymentMethod) {
			throw new Error(
				`PaymentMethod with id ${attemptData.paymentMethodId} not found`,
			);
		}

		const attemptModel = new PaymentAttemptModel({
			status: attemptData.status,
			failureReason: attemptData.failureReason,
			customerIp: attemptData.customerIp,
			customerData: attemptData.customerData,
			attemptedAt: attemptData.attemptedAt || new Date(),
			transaction: transaction,
			paymentMethod: paymentMethod,
		});

		await this.options.em.persistAndFlush(attemptModel);
		return attemptModel;
	};

	update: IPaymentAttemptRepository["update"] = async (id, attemptData) => {
		const attempt = await this.options.em.findOne(PaymentAttemptModel, { id });
		if (!attempt) {
			throw new Error(`PaymentAttempt with id ${id} not found`);
		}

		if (attemptData.transactionId !== undefined) {
			const transaction = await this.options.em.findOne(TransactionModel, {
				id: attemptData.transactionId,
			});
			if (!transaction) {
				throw new Error(
					`Transaction with id ${attemptData.transactionId} not found`,
				);
			}
			attempt.transaction = transaction;
		}

		if (attemptData.paymentMethodId !== undefined) {
			const paymentMethod = await this.options.em.findOne(PaymentMethodModel, {
				id: attemptData.paymentMethodId,
			});
			if (!paymentMethod) {
				throw new Error(
					`PaymentMethod with id ${attemptData.paymentMethodId} not found`,
				);
			}
			attempt.paymentMethod = paymentMethod;
		}

		const { transactionId, paymentMethodId, ...updateData } = attemptData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(attempt, filteredUpdateData);
		await this.options.em.flush();
		return attempt as IPaymentAttempt;
	};

	delete: IPaymentAttemptRepository["delete"] = async (id) => {
		const attempt = await this.options.em.findOne(PaymentAttemptModel, { id });
		if (!attempt) {
			return;
		}

		await this.options.em.removeAndFlush(attempt);
	};
}
