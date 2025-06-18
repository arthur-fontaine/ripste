import type { EntityManager, FilterQuery } from "@mikro-orm/core";
import type { ICheckoutPageRepository } from "../../domain/ports/ICheckoutPageRepository.ts";
import type { ICheckoutPage } from "../../domain/models/ICheckoutPage.ts";
import { CheckoutPageModel } from "./models/CheckoutPageModel.ts";
import { TransactionModel } from "./models/TransactionModel.ts";
import { CheckoutThemeModel } from "./models/CheckoutThemeModel.ts";

interface IMikroormCheckoutPageRepositoryOptions {
	em: EntityManager;
}

export class MikroormCheckoutPageRepository implements ICheckoutPageRepository {
	private options: IMikroormCheckoutPageRepositoryOptions;

	constructor(options: IMikroormCheckoutPageRepositoryOptions) {
		this.options = options;
	}

	findById: ICheckoutPageRepository["findById"] = async (id) => {
		const page = await this.options.em.findOne(
			CheckoutPageModel,
			{ id, deletedAt: null },
			{
				populate: ["transaction", "theme"],
			},
		);
		return page;
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
		const transaction = await this.options.em.findOne(TransactionModel, {
			id: pageData.transactionId,
			deletedAt: null,
		});
		if (!transaction) {
			throw new Error(
				`Transaction with id ${pageData.transactionId} not found`,
			);
		}

		const theme = await this.options.em.findOne(CheckoutThemeModel, {
			id: pageData.themeId,
			deletedAt: null,
		});
		if (!theme) {
			throw new Error(`CheckoutTheme with id ${pageData.themeId} not found`);
		}

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
		const page = await this.options.em.findOne(CheckoutPageModel, {
			id,
			deletedAt: null,
		});
		if (!page) {
			throw new Error(`CheckoutPage with id ${id} not found`);
		}

		if (pageData.transactionId !== undefined) {
			const transaction = await this.options.em.findOne(TransactionModel, {
				id: pageData.transactionId,
				deletedAt: null,
			});
			if (!transaction) {
				throw new Error(
					`Transaction with id ${pageData.transactionId} not found`,
				);
			}
			page.transaction = transaction;
		}

		if (pageData.themeId !== undefined) {
			const theme = await this.options.em.findOne(CheckoutThemeModel, {
				id: pageData.themeId,
				deletedAt: null,
			});
			if (!theme) {
				throw new Error(`CheckoutTheme with id ${pageData.themeId} not found`);
			}
			page.theme = theme;
		}

		const { transactionId, themeId, ...updateData } = pageData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(page, filteredUpdateData);
		await this.options.em.flush();
		return page as ICheckoutPage;
	};

	delete: ICheckoutPageRepository["delete"] = async (id) => {
		const page = await this.options.em.findOne(CheckoutPageModel, {
			id,
			deletedAt: null,
		});
		if (!page) {
			return;
		}

		// Soft delete by setting deletedAt timestamp
		page.deletedAt = new Date();
		await this.options.em.flush();
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
