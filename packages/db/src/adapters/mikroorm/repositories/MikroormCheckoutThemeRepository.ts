import type { EntityManager, FilterQuery } from "@mikro-orm/core";
import type { ICheckoutThemeRepository } from "../../../domain/ports/ICheckoutThemeRepository.ts";
import type { ICheckoutTheme } from "../../../domain/models/ICheckoutTheme.ts";
import { CheckoutThemeModel } from "../models/CheckoutThemeModel.ts";
import { StoreModel } from "../models/StoreModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

interface IMikroormCheckoutThemeRepositoryOptions {
	em: EntityManager;
}

const POPULATE_FIELDS = ["store", "customizations", "checkoutPages"] as const;

export class MikroormCheckoutThemeRepository
	implements ICheckoutThemeRepository
{
	private options: IMikroormCheckoutThemeRepositoryOptions;

	constructor(options: IMikroormCheckoutThemeRepositoryOptions) {
		this.options = options;
	}

	findById: ICheckoutThemeRepository["findById"] = async (id) => {
		return RepoUtils.findById<ICheckoutTheme, CheckoutThemeModel>(
			this.options.em,
			CheckoutThemeModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: ICheckoutThemeRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<CheckoutThemeModel> = {};

		if (params.storeId) whereClause.store = { id: params.storeId };
		if (params.name) whereClause.name = params.name;
		if (params.version) whereClause.version = params.version;

		if (params.latestVersion) {
			if (params.storeId && params.name) {
				const theme = await this.options.em.findOne(
					CheckoutThemeModel,
					{ ...whereClause, deletedAt: null },
					{
						populate: POPULATE_FIELDS,
						orderBy: { version: "DESC" },
					},
				);
				return theme ? [theme] : [];
			}

			const themes = await this.options.em.find(
				CheckoutThemeModel,
				{ ...whereClause, deletedAt: null },
				{
					populate: POPULATE_FIELDS,
					orderBy: { version: "DESC" },
				},
			);
			return themes;
		}

		return RepoUtils.findMany<ICheckoutTheme, CheckoutThemeModel>(
			this.options.em,
			CheckoutThemeModel,
			whereClause,
			POPULATE_FIELDS,
		);
	};

	getNextVersion: ICheckoutThemeRepository["getNextVersion"] = async (
		storeId,
		name,
	) => {
		const latestTheme = await this.options.em.findOne(
			CheckoutThemeModel,
			{
				store: { id: storeId },
				name,
			},
			{
				orderBy: { version: "DESC" },
			},
		);
		return latestTheme ? latestTheme.version + 1 : 1;
	};

	create: ICheckoutThemeRepository["create"] = async (themeData) => {
		const store = await RepoUtils.findRelatedEntity(
			this.options.em,
			StoreModel,
			themeData.storeId,
			"Store",
		);

		const themeModel = new CheckoutThemeModel({
			name: themeData.name,
			version: themeData.version,
			store: store,
		});

		await this.options.em.persistAndFlush(themeModel);
		return themeModel;
	};

	update: ICheckoutThemeRepository["update"] = async (id, themeData) => {
		const theme = await this.options.em.findOne(CheckoutThemeModel, {
			id,
			deletedAt: null,
		});
		if (!theme) {
			throw new Error(`CheckoutTheme with id ${id} not found`);
		}

		if (themeData.storeId !== undefined) {
			const store = await this.options.em.findOne(StoreModel, {
				id: themeData.storeId,
				deletedAt: null,
			});
			if (!store) {
				throw new Error(`Store with id ${themeData.storeId} not found`);
			}
			theme.store = store;
		}

		const { storeId, customizations, ...updateData } = themeData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(theme, filteredUpdateData);
		await this.options.em.flush();
		return theme as ICheckoutTheme;
	};

	delete: ICheckoutThemeRepository["delete"] = async (id) => {
		const theme = await this.options.em.findOne(CheckoutThemeModel, {
			id,
			deletedAt: null,
		});
		if (!theme) {
			return;
		}

		theme.deletedAt = new Date();
		await this.options.em.flush();
	};
}
