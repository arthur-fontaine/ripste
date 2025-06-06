import type { Insertable } from "../../types/insertable.ts";
import type { ICheckoutTheme } from "./ICheckoutTheme.ts";
import type { ITransaction } from "./ITransaction.ts";

export interface ICheckoutPage {
	id: string;
	uri: string;
	redirectSuccessUrl: string;
	redirectCancelUrl: string | null;
	displayData: CheckoutDisplayData | null;
	expiresAt: Date | null;
	createdAt: Date;
	accessedAt: Date | null;
	completedAt: Date | null;

	transaction: ITransaction | null;
	theme: ICheckoutTheme | null;
}

export type IInsertCheckoutPage = Insertable<
	ICheckoutPage,
	"transaction" | "theme" | "displayData"
> & {
	transactionId: ITransaction["id"] | null;
	themeId: ICheckoutTheme["id"] | null;
	displayData: CheckoutDisplayData | null;
};

export interface CheckoutDisplayData {
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
	} | null>;

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
