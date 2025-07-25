import type { ISU } from "isutypes";
import type { IBaseModel } from "./IBaseModel.ts";
import { createFakeGenerator } from "interface-faker";
import type { ITransactionTable } from "./ITransaction.ts";
import type { ICheckoutThemeTable } from "./ICheckoutTheme.ts";

export interface ICheckoutPageTable extends IBaseModel {
	uri: string;
	redirectSuccessUrl: string | null;
	redirectCancelUrl: string | null;
	displayData: ICheckoutDisplayData;
	expiresAt: Date | null;
	accessedAt: Date | null;
	completedAt: Date | null;

	transaction: ISU.SingleReference<ITransactionTable, "transactionId", "id">;
	theme: ISU.SingleReference<ICheckoutThemeTable, "themeId", "id">;
}

export interface ICheckoutPage extends ISU.Selectable<ICheckoutPageTable> {}
export interface IInsertCheckoutPage
	extends ISU.Insertable<ICheckoutPageTable> {}
export interface IUpdateCheckoutPage
	extends ISU.Updateable<ICheckoutPageTable> {}

export interface ICheckoutDisplayData {
	title: string;
	description: string | null;

	logo: {
		url: string;
		alt: string | null;
		width: number | null;
		height: number | null;
	} | null;

	colors: {
		primary: string | null;
		secondary: string | null;
		background: string | null;
		text: string | null;
		success: string | null;
		error: string | null;
	} | null;

	items: Array<{
		name: string;
		description: string | null;
		quantity: number;
		unitPrice: number;
		imageUrl: string | null;
	}> | null;

	contact: {
		supportEmail: string | null;
		supportPhone: string | null;
		website: string | null;
	} | null;

	settings: {
		showItems: boolean;
		showTotal: boolean;
		showCurrency: boolean;
		language: "fr" | "en" | "es" | "de";
		showPoweredBy: boolean;
	} | null;

	customTexts: {
		payButton: string | null;
		cancelButton: string | null;
		processingMessage: string | null;
		successMessage: string | null;
		errorMessage: string | null;
	} | null;
}

export const generateFakeCheckoutPage = createFakeGenerator<ICheckoutPage>(
	"ICheckoutPage",
	__filename,
);

export const generateFakeInsertCheckoutPage =
	createFakeGenerator<IInsertCheckoutPage>("IInsertCheckoutPage", __filename);
