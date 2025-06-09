import type { EntityManager } from "@mikro-orm/core";
import type { ICheckoutThemeRepository } from "../../domain/ports/ICheckoutThemeRepository.ts";
import type { ICheckoutTheme } from "../../domain/models/ICheckoutTheme.ts";
import { CheckoutThemeModel } from "./models/CheckoutThemeModel.ts";
import { StoreModel } from "./models/StoreModel.ts";

interface IMikroormCheckoutThemeRepositoryOptions {
	em: EntityManager;
}

export class MikroormCheckoutThemeRepository
	implements ICheckoutThemeRepository
{
	private options: IMikroormCheckoutThemeRepositoryOptions;

	constructor(options: IMikroormCheckoutThemeRepositoryOptions) {
		this.options = options;
	}

	findById: ICheckoutThemeRepository["findById"] = async (id) => {
		const theme = await this.options.em.findOne(
			CheckoutThemeModel,
			{ id },
			{
				populate: ["store", "customizations", "checkoutPages"],
			},
		);
		return theme;
	};

	findByStoreId: ICheckoutThemeRepository["findByStoreId"] = async (
		storeId,
	) => {
		const themes = await this.options.em.find(
			CheckoutThemeModel,
			{
				store: { id: storeId },
			},
			{
				populate: ["store", "customizations", "checkoutPages"],
			},
		);
		return themes;
	};

	findByName: ICheckoutThemeRepository["findByName"] = async (name) => {
		const themes = await this.options.em.find(
			CheckoutThemeModel,
			{ name },
			{
				populate: ["store", "customizations", "checkoutPages"],
			},
		);
		return themes;
	};

	findByStoreAndName: ICheckoutThemeRepository["findByStoreAndName"] = async (
		storeId,
		name,
	) => {
		const themes = await this.options.em.find(
			CheckoutThemeModel,
			{
				store: { id: storeId },
				name,
			},
			{
				populate: ["store", "customizations", "checkoutPages"],
			},
		);
		return themes;
	};

	findLatestVersion: ICheckoutThemeRepository["findLatestVersion"] = async (
		storeId,
		name,
	) => {
		const theme = await this.options.em.findOne(
			CheckoutThemeModel,
			{
				store: { id: storeId },
				name,
			},
			{
				populate: ["store", "customizations", "checkoutPages"],
				orderBy: { version: "DESC" },
			},
		);
		return theme;
	};

	findByStoreNameAndVersion: ICheckoutThemeRepository["findByStoreNameAndVersion"] =
		async (storeId, name, version) => {
			const theme = await this.options.em.findOne(
				CheckoutThemeModel,
				{
					store: { id: storeId },
					name,
					version,
				},
				{
					populate: ["store", "customizations", "checkoutPages"],
				},
			);
			return theme;
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
		let store: StoreModel | null = null;
		if (themeData.storeId) {
			store = await this.options.em.findOne(StoreModel, {
				id: themeData.storeId,
			});
		}

		const themeModel = new CheckoutThemeModel({
			name: themeData.name,
			version: themeData.version,
			store: store,
		});

		await this.options.em.persistAndFlush(themeModel);
		return themeModel;
	};

	update: ICheckoutThemeRepository["update"] = async (id, themeData) => {
		const theme = await this.options.em.findOne(CheckoutThemeModel, { id });
		if (!theme) {
			throw new Error(`CheckoutTheme with id ${id} not found`);
		}

		if (themeData.storeId !== undefined) {
			if (themeData.storeId === null) {
				theme.store = null;
			} else {
				const store = await this.options.em.findOne(StoreModel, {
					id: themeData.storeId,
				});
				if (store) {
					theme.store = store;
				}
			}
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
		const theme = await this.options.em.findOne(CheckoutThemeModel, { id });
		if (!theme) {
			return;
		}

		await this.options.em.removeAndFlush(theme);
	};

	deleteByStoreId: ICheckoutThemeRepository["deleteByStoreId"] = async (
		storeId,
	) => {
		const themes = await this.options.em.find(CheckoutThemeModel, {
			store: { id: storeId },
		});

		if (themes.length > 0) {
			await this.options.em.removeAndFlush(themes);
		}
	};
}
