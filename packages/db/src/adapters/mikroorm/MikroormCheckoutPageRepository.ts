import type { EntityManager } from "@mikro-orm/core";
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
			{ id },
			{
				populate: ["transaction", "theme"],
			},
		);
		return page;
	};

	findMany: ICheckoutPageRepository["findMany"] = async (params) => {
		interface WhereClause {
			transaction?: { id: string };
			theme?: { id: string };
			expiresAt?: { $lt: Date } | { $gt: Date };
			uri?: string;
			accessedAt?: { $ne: null } | { $gte?: Date; $lte?: Date };
			completedAt?: { $ne: null } | { $gte?: Date; $lte?: Date } | null;
			$or?: Array<{ expiresAt: null } | { expiresAt: { $gt: Date } }>;
			createdAt?: { $gte?: Date; $lte?: Date };
		}

		const whereClause: WhereClause = {};

		if (params.transactionId) {
			whereClause.transaction = { id: params.transactionId };
		}

		if (params.themeId) {
			whereClause.theme = { id: params.themeId };
		}

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

		if (params.uri) {
			whereClause.uri = params.uri;
		}

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
		let transaction: TransactionModel | null = null;
		if (pageData.transactionId) {
			transaction = await this.options.em.findOne(TransactionModel, {
				id: pageData.transactionId,
			});
		}

		let theme: CheckoutThemeModel | null = null;
		if (pageData.themeId) {
			theme = await this.options.em.findOne(CheckoutThemeModel, {
				id: pageData.themeId,
			});
		}

		const pageModel = new CheckoutPageModel({
			uri: pageData.uri,
			redirectSuccessUrl: pageData.redirectSuccessUrl,
			redirectCancelUrl: pageData.redirectCancelUrl,
			displayData: pageData.displayData,
			expiresAt: pageData.expiresAt,
			accessedAt: pageData.accessedAt,
			completedAt: pageData.completedAt,
			transaction: transaction,
			theme: theme,
		});

		await this.options.em.persistAndFlush(pageModel);
		return pageModel;
	};

	update: ICheckoutPageRepository["update"] = async (id, pageData) => {
		const page = await this.options.em.findOne(CheckoutPageModel, { id });
		if (!page) {
			throw new Error(`CheckoutPage with id ${id} not found`);
		}

		if (pageData.transactionId !== undefined) {
			if (pageData.transactionId === null) {
				page.transaction = null;
			} else {
				const transaction = await this.options.em.findOne(TransactionModel, {
					id: pageData.transactionId,
				});
				if (transaction) {
					page.transaction = transaction;
				}
			}
		}

		if (pageData.themeId !== undefined) {
			if (pageData.themeId === null) {
				page.theme = null;
			} else {
				const theme = await this.options.em.findOne(CheckoutThemeModel, {
					id: pageData.themeId,
				});
				if (theme) {
					page.theme = theme;
				}
			}
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
		const page = await this.options.em.findOne(CheckoutPageModel, { id });
		if (!page) {
			return;
		}

		await this.options.em.removeAndFlush(page);
	};

	deleteExpiredPages: ICheckoutPageRepository["deleteExpiredPages"] =
		async () => {
			const expiredPages = await this.options.em.find(CheckoutPageModel, {
				expiresAt: { $lt: new Date() },
			});

			if (expiredPages.length > 0) {
				await this.options.em.removeAndFlush(expiredPages);
			}
		};
}
