import type { IRefundRepository } from "../../../domain/ports/IRefundRepository.ts";
import { RefundModel } from "../models/RefundModel.ts";
import { TransactionModel } from "../models/TransactionModel.ts";
import { UserModel } from "../models/UserModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";
import type { FilterQuery } from "@mikro-orm/core";

const POPULATE_FIELDS = ["transaction", "initiatedByUser"] as const;

export class MikroormRefundRepository implements IRefundRepository {
	private options: RepoUtils.IMikroormRepositoryOptions;

	constructor(options: RepoUtils.IMikroormRepositoryOptions) {
		this.options = options;
	}

	findById: IRefundRepository["findById"] = async (id) => {
		return await RepoUtils.findById(
			this.options.em,
			RefundModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: IRefundRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<RefundModel> = {};

		if (params.transactionId)
			whereClause.transaction = { id: params.transactionId };

		if (params.initiatedByUserId)
			whereClause.initiatedByUser = { id: params.initiatedByUserId };

		if (params.status) whereClause.status = params.status;

		return await RepoUtils.findMany(
			this.options.em,
			RefundModel,
			whereClause,
			POPULATE_FIELDS,
		);
	};

	getTotalRefundedAmount: IRefundRepository["getTotalRefundedAmount"] = async (
		transactionId,
	) => {
		const refunds = await this.options.em.find(RefundModel, {
			transaction: { id: transactionId },
			status: "completed",
		});

		return refunds.reduce(
			(total: number, refund: RefundModel) => total + refund.amount,
			0,
		);
	};

	create: IRefundRepository["create"] = async (refundData) => {
		const transaction = await RepoUtils.findRelatedEntity(
			this.options.em,
			TransactionModel,
			refundData.transactionId,
			"Transaction",
		);

		let initiatedByUser: UserModel | null = null;
		if (refundData.initiatedByUserId) {
			initiatedByUser = await RepoUtils.findRelatedEntity(
				this.options.em,
				UserModel,
				refundData.initiatedByUserId,
				"User",
			);
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
		const updateData: Record<string, unknown> = {};

		if (refundData.transactionId !== undefined) {
			const transaction = await RepoUtils.findRelatedEntity(
				this.options.em,
				TransactionModel,
				refundData.transactionId,
				"Transaction",
			);
			updateData["transaction"] = transaction;
		}

		if (refundData.initiatedByUserId !== undefined) {
			if (refundData.initiatedByUserId === null) {
				updateData["initiatedByUser"] = null;
			} else {
				const user = await RepoUtils.findRelatedEntity(
					this.options.em,
					UserModel,
					refundData.initiatedByUserId,
					"User",
				);
				updateData["initiatedByUser"] = user;
			}
		}

		const { transactionId, initiatedByUserId, ...otherData } = refundData;
		Object.assign(updateData, RepoUtils.filterUpdateData(otherData));

		return await RepoUtils.updateEntity(
			this.options.em,
			RefundModel,
			id,
			updateData,
			POPULATE_FIELDS,
		);
	};

	delete: IRefundRepository["delete"] = async (id) => {
		await RepoUtils.deleteEntity(this.options.em, RefundModel, id);
	};
}
