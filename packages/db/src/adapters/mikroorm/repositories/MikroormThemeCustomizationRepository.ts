import type { FilterQuery } from "@mikro-orm/core";
import type { IThemeCustomizationRepository } from "../../../domain/ports/IThemeCustomizationRepository.ts";
import type { IThemeCustomization } from "../../../domain/models/IThemeCustomization.ts";
import { ThemeCustomizationModel } from "../models/ThemeCustomizationModel.ts";
import { CheckoutThemeModel } from "../models/CheckoutThemeModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

const POPULATE_FIELDS = ["theme"] as const;

export class MikroormThemeCustomizationRepository
	implements IThemeCustomizationRepository
{
	private options: RepoUtils.IMikroormRepositoryOptions;

	constructor(options: RepoUtils.IMikroormRepositoryOptions) {
		this.options = options;
	}

	findById: IThemeCustomizationRepository["findById"] = async (id) => {
		return RepoUtils.findById<IThemeCustomization, ThemeCustomizationModel>(
			this.options.em,
			ThemeCustomizationModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: IThemeCustomizationRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<ThemeCustomizationModel> = {};

		if (params.themeId) whereClause.theme = { id: params.themeId };

		if (params.customizationType)
			whereClause.customizationType = params.customizationType;

		return RepoUtils.findMany<IThemeCustomization, ThemeCustomizationModel>(
			this.options.em,
			ThemeCustomizationModel,
			whereClause,
			POPULATE_FIELDS,
		);
	};

	create: IThemeCustomizationRepository["create"] = async (
		customizationData,
	) => {
		const theme = await this.options.em.findOne(CheckoutThemeModel, {
			id: customizationData.themeId,
		});
		if (!theme) {
			throw new Error(
				`CheckoutTheme with id ${customizationData.themeId} not found`,
			);
		}

		const customizationModel = new ThemeCustomizationModel({
			customizationType: customizationData.customizationType,
			content: customizationData.content,
			theme: theme,
		});

		await this.options.em.persistAndFlush(customizationModel);
		return customizationModel;
	};

	update: IThemeCustomizationRepository["update"] = async (
		id,
		customizationData,
	) => {
		const customization = await this.options.em.findOne(
			ThemeCustomizationModel,
			{
				id,
				deletedAt: null,
			},
		);
		if (!customization) {
			throw new Error(`ThemeCustomization with id ${id} not found`);
		}

		if (customizationData.themeId !== undefined) {
			const theme = await this.options.em.findOne(CheckoutThemeModel, {
				id: customizationData.themeId,
			});
			if (!theme) {
				throw new Error(
					`CheckoutTheme with id ${customizationData.themeId} not found`,
				);
			}
			customization.theme = theme;
		}

		const { themeId, ...updateData } = customizationData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(customization, filteredUpdateData);
		await this.options.em.flush();
		return customization as IThemeCustomization;
	};

	delete: IThemeCustomizationRepository["delete"] = async (id) => {
		const customization = await this.options.em.findOne(
			ThemeCustomizationModel,
			{
				id,
				deletedAt: null,
			},
		);
		if (!customization) {
			return;
		}

		customization.deletedAt = new Date();
		await this.options.em.flush();
	};

	deleteByThemeId: IThemeCustomizationRepository["deleteByThemeId"] = async (
		themeId,
	) => {
		const customizations = await this.options.em.find(ThemeCustomizationModel, {
			theme: { id: themeId },
			deletedAt: null,
		});

		if (customizations.length > 0) {
			for (const customization of customizations) {
				customization.deletedAt = new Date();
			}
			await this.options.em.flush();
		}
	};
}
