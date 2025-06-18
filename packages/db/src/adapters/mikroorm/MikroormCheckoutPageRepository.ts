import type { FilterQuery } from "@mikro-orm/core";
import type { ICheckoutPageRepository } from "../../domain/ports/ICheckoutPageRepository.ts";
import { CheckoutPageModel } from "./models/CheckoutPageModel.ts";
import { TransactionModel } from "./models/TransactionModel.ts";
import { CheckoutThemeModel } from "./models/CheckoutThemeModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

const POPULATE_FIELDS = ["transaction", "theme"] as const;

export class MikroormCheckoutPageRepository implements ICheckoutPageRepository {
	private options: RepoUtils.IMikroormRepositoryOptions;

	constructor(options: RepoUtils.IMikroormRepositoryOptions) {
		this.options = options;
	}

	findById: ICheckoutPageRepository["findById"] = async (id) => {
		return await RepoUtils.findById(
			this.options.em,
			CheckoutPageModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: ICheckoutPageRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<CheckoutPageModel> = {
			deletedAt: null,
		};

		if (params.transactionId)
			whereClause.transaction = { id: params.transactionId };

		if (params.themeId) whereClause.theme = { id: params.themeId };

		if (params.expired !== undefined) {
			if (params.expired) {
				whereClause.expiresAt = { $lt: new Date() };
			} else {
				whereClause.$or = [
					{ expiresAt: null },
					{ expiresAt: { $gt: new Date() } },
				];
			}
		}

		if (params.uri) whereClause.uri = params.uri;

		if (params.accessed !== undefined) {
			if (params.accessed) {
				const dateFilter: { $gte?: Date; $lte?: Date } = {};
				if (params.fromDate) dateFilter.$gte = params.fromDate;
				if (params.toDate) dateFilter.$lte = params.toDate;

				if (params.fromDate || params.toDate) {
					whereClause.accessedAt = dateFilter;
				} else {
					whereClause.accessedAt = { $ne: null };
				}
			}
		}

		if (params.completed !== undefined) {
			if (params.completed) {
				const dateFilter: { $gte?: Date; $lte?: Date } = {};
				if (params.fromDate) dateFilter.$gte = params.fromDate;
				if (params.toDate) dateFilter.$lte = params.toDate;

				if (params.fromDate || params.toDate) {
					whereClause.completedAt = dateFilter;
				} else {
					whereClause.completedAt = { $ne: null };
				}
			}
		}

		if (params.pending !== undefined && params.pending) {
			whereClause.completedAt = null;
			whereClause.$or = [
				{ expiresAt: null },
				{ expiresAt: { $gt: new Date() } },
			];
		}

		if (
			!params.accessed &&
			!params.completed &&
			(params.fromDate || params.toDate)
		) {
			const dateFilter: { $gte?: Date; $lte?: Date } = {};
			if (params.fromDate) dateFilter.$gte = params.fromDate;
			if (params.toDate) dateFilter.$lte = params.toDate;
			whereClause.createdAt = dateFilter;
		}

		const pages = await this.options.em.find(CheckoutPageModel, whereClause, {
			populate: ["transaction", "theme"],
		});
		return pages;
	};

	markAsAccessed: ICheckoutPageRepository["markAsAccessed"] = async (id) => {
		const page = await this.options.em.findOne(
			CheckoutPageModel,
			{ id },
			{
				populate: ["transaction", "theme"],
			},
		);
		if (!page) {
			throw new Error(`CheckoutPage with id ${id} not found`);
		}

		page.accessedAt = new Date();
		await this.options.em.flush();
		return page;
	};

	markAsCompleted: ICheckoutPageRepository["markAsCompleted"] = async (id) => {
		const page = await this.options.em.findOne(
			CheckoutPageModel,
			{ id },
			{
				populate: ["transaction", "theme"],
			},
		);
		if (!page) {
			throw new Error(`CheckoutPage with id ${id} not found`);
		}

		page.completedAt = new Date();
		await this.options.em.flush();
		return page;
	};

	create: ICheckoutPageRepository["create"] = async (pageData) => {
		const transaction = await RepoUtils.findRelatedEntity(
			this.options.em,
			TransactionModel,
			pageData.transactionId,
			"Transaction",
		);

		const theme = await RepoUtils.findRelatedEntity(
			this.options.em,
			CheckoutThemeModel,
			pageData.themeId,
			"CheckoutTheme",
		);

		const pageModel = new CheckoutPageModel({
			uri: pageData.uri,
			displayData: pageData.displayData,
			transaction: transaction,
			theme: theme,
			redirectSuccessUrl: pageData.redirectSuccessUrl,
			redirectCancelUrl: pageData.redirectCancelUrl,
			expiresAt: pageData.expiresAt,
			accessedAt: pageData.accessedAt,
			completedAt: pageData.completedAt,
		});

		await this.options.em.persistAndFlush(pageModel);
		return pageModel;
	};

	update: ICheckoutPageRepository["update"] = async (id, pageData) => {
		const updateData: Record<string, unknown> = {};

		if (pageData.transactionId !== undefined) {
			const transaction = await RepoUtils.findRelatedEntity(
				this.options.em,
				TransactionModel,
				pageData.transactionId,
				"Transaction",
			);
			updateData["transaction"] = transaction;
		}

		if (pageData.themeId !== undefined) {
			const theme = await RepoUtils.findRelatedEntity(
				this.options.em,
				CheckoutThemeModel,
				pageData.themeId,
				"CheckoutTheme",
			);
			updateData["theme"] = theme;
		}

		const { transactionId, themeId, ...otherData } = pageData;
		Object.assign(updateData, RepoUtils.filterUpdateData(otherData));

		return await RepoUtils.updateEntity(
			this.options.em,
			CheckoutPageModel,
			id,
			updateData,
			POPULATE_FIELDS,
		);
	};

	delete: ICheckoutPageRepository["delete"] = async (id) => {
		await RepoUtils.deleteEntity(this.options.em, CheckoutPageModel, id);
	};

	deleteExpiredPages: ICheckoutPageRepository["deleteExpiredPages"] =
		async () => {
			const expiredPages = await this.options.em.find(CheckoutPageModel, {
				expiresAt: { $lt: new Date() },
				deletedAt: null,
			});

			if (expiredPages.length > 0) {
				for (const page of expiredPages) {
					page.deletedAt = new Date();
				}
				await this.options.em.flush();
			}
		};
}
