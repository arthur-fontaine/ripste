import type { EntityManager } from "@mikro-orm/core";
import type { IRefundRepository } from "../../domain/ports/IRefundRepository.ts";
import type { IRefund } from "../../domain/models/IRefund.ts";
import { RefundModel } from "./models/RefundModel.ts";
import { TransactionModel } from "./models/TransactionModel.ts";
import { UserModel } from "./models/UserModel.ts";

interface IMikroormRefundRepositoryOptions {
	em: EntityManager;
}

export class MikroormRefundRepository implements IRefundRepository {
	private options: IMikroormRefundRepositoryOptions;

	constructor(options: IMikroormRefundRepositoryOptions) {
		this.options = options;
	}

	findById: IRefundRepository["findById"] = async (id) => {
		const refund = await this.options.em.findOne(
			RefundModel,
			{ id },
			{
				populate: ["transaction", "initiatedByUser"],
			},
		);
		return refund;
	};

	findMany: IRefundRepository["findMany"] = async (params) => {
		interface WhereClause {
			transaction?: { id: string };
			initiatedByUser?: { id: string };
			status?: "pending" | "processing" | "completed" | "failed";
		}

		const whereClause: WhereClause = {};

		if (params.transactionId) {
			whereClause.transaction = { id: params.transactionId };
		}

		if (params.initiatedByUserId) {
			whereClause.initiatedByUser = { id: params.initiatedByUserId };
		}

		if (params.status) {
			whereClause.status = params.status;
		}

		const refunds = await this.options.em.find(RefundModel, whereClause, {
			populate: ["transaction", "initiatedByUser"],
		});
		return refunds;
	};

	getTotalRefundedAmount: IRefundRepository["getTotalRefundedAmount"] = async (
		transactionId,
	) => {
		const refunds = await this.options.em.find(RefundModel, {
			transaction: { id: transactionId },
			status: "completed",
		});

		return refunds.reduce((total, refund) => total + refund.amount, 0);
	};

	create: IRefundRepository["create"] = async (refundData) => {
		let transaction: TransactionModel | null = null;
		if (refundData.transactionId) {
			transaction = await this.options.em.findOne(TransactionModel, {
				id: refundData.transactionId,
			});
			if (!transaction) {
				throw new Error(
					`Transaction with id ${refundData.transactionId} not found`,
				);
			}
		}

		let initiatedByUser: UserModel | null = null;
		if (refundData.initiatedByUserId) {
			initiatedByUser = await this.options.em.findOne(UserModel, {
				id: refundData.initiatedByUserId,
			});
			if (!initiatedByUser) {
				throw new Error(
					`User with id ${refundData.initiatedByUserId} not found`,
				);
			}
		}

		const refundModel = new RefundModel({
			amount: refundData.amount,
			reason: refundData.reason,
			status: refundData.status,
			processedAt: refundData.processedAt,
			transaction,
			initiatedByUser,
		});

		await this.options.em.persistAndFlush(refundModel);
		return refundModel;
	};

	update: IRefundRepository["update"] = async (id, refundData) => {
		const refund = await this.options.em.findOne(RefundModel, { id });
		if (!refund) {
			throw new Error(`Refund with id ${id} not found`);
		}

		const relationUpdates: Partial<RefundModel> = {};

		if (refundData.transactionId !== undefined) {
			if (refundData.transactionId === null) {
				relationUpdates.transaction = null;
			} else {
				const transaction = await this.options.em.findOne(TransactionModel, {
					id: refundData.transactionId,
				});
				if (!transaction) {
					throw new Error(
						`Transaction with id ${refundData.transactionId} not found`,
					);
				}
				relationUpdates.transaction = transaction;
			}
		}

		if (refundData.initiatedByUserId !== undefined) {
			if (refundData.initiatedByUserId === null) {
				relationUpdates.initiatedByUser = null;
			} else {
				const user = await this.options.em.findOne(UserModel, {
					id: refundData.initiatedByUserId,
				});
				if (!user) {
					throw new Error(
						`User with id ${refundData.initiatedByUserId} not found`,
					);
				}
				relationUpdates.initiatedByUser = user;
			}
		}

		const { transactionId, initiatedByUserId, ...updateData } = refundData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(refund, {
			...filteredUpdateData,
			...relationUpdates,
		});
		await this.options.em.flush();
		return refund as IRefund;
	};

	delete: IRefundRepository["delete"] = async (id) => {
		const refund = await this.options.em.findOne(RefundModel, { id });
		if (!refund) {
			return;
		}

		await this.options.em.removeAndFlush(refund);
	};
}
