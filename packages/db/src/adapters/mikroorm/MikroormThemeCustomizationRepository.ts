import type { EntityManager } from "@mikro-orm/core";
import type { IThemeCustomizationRepository } from "../../domain/ports/IThemeCustomizationRepository.ts";
import type { IThemeCustomization } from "../../domain/models/IThemeCustomization.ts";
import { ThemeCustomizationModel } from "./models/ThemeCustomizationModel.ts";
import { CheckoutThemeModel } from "./models/CheckoutThemeModel.ts";

interface IMikroormThemeCustomizationRepositoryOptions {
	em: EntityManager;
}

export class MikroormThemeCustomizationRepository
	implements IThemeCustomizationRepository
{
	private options: IMikroormThemeCustomizationRepositoryOptions;

	constructor(options: IMikroormThemeCustomizationRepositoryOptions) {
		this.options = options;
	}

	findById: IThemeCustomizationRepository["findById"] = async (id) => {
		const customization = await this.options.em.findOne(
			ThemeCustomizationModel,
			{ id },
			{
				populate: ["theme"],
			},
		);
		return customization;
	};

	findByThemeId: IThemeCustomizationRepository["findByThemeId"] = async (
		themeId,
	) => {
		const customizations = await this.options.em.find(
			ThemeCustomizationModel,
			{
				theme: { id: themeId },
			},
			{
				populate: ["theme"],
			},
		);
		return customizations;
	};

	findByCustomizationType: IThemeCustomizationRepository["findByCustomizationType"] =
		async (customizationType) => {
			const customizations = await this.options.em.find(
				ThemeCustomizationModel,
				{ customizationType },
				{
					populate: ["theme"],
				},
			);
			return customizations;
		};

	findByThemeAndType: IThemeCustomizationRepository["findByThemeAndType"] =
		async (themeId, customizationType) => {
			const customization = await this.options.em.findOne(
				ThemeCustomizationModel,
				{
					theme: { id: themeId },
					customizationType,
				},
				{
					populate: ["theme"],
				},
			);
			return customization;
		};

	create: IThemeCustomizationRepository["create"] = async (
		customizationData,
	) => {
		let theme: CheckoutThemeModel | null = null;
		if (customizationData.themeId) {
			theme = await this.options.em.findOne(CheckoutThemeModel, {
				id: customizationData.themeId,
			});
			if (!theme) {
				throw new Error(
					`CheckoutTheme with id ${customizationData.themeId} not found`,
				);
			}
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
			{ id },
		);
		if (!customization) {
			throw new Error(`ThemeCustomization with id ${id} not found`);
		}

		if (customizationData.themeId !== undefined) {
			if (customizationData.themeId === null) {
				customization.theme = null;
			} else {
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
			{ id },
		);
		if (!customization) {
			return;
		}

		await this.options.em.removeAndFlush(customization);
	};

	deleteByThemeId: IThemeCustomizationRepository["deleteByThemeId"] = async (
		themeId,
	) => {
		const customizations = await this.options.em.find(ThemeCustomizationModel, {
			theme: { id: themeId },
		});

		if (customizations.length > 0) {
			await this.options.em.removeAndFlush(customizations);
		}
	};
}
