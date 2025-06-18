import * as z from "./utils/zod-db.ts";
import { Transaction } from "./Transaction.ts";
import { CheckoutTheme } from "./CheckoutTheme.ts";
import { zocker } from "zocker";

export const checkoutPageTable = z.table({
	id: z.string(),
	uri: z.string(),
	redirectSuccessUrl: z.nullable(z.string()),
	redirectCancelUrl: z.nullable(z.string()),
	displayData: z.lazy(() => CheckoutDisplayData),
	expiresAt: z.nullable(z.iso.datetime()),
	accessedAt: z.nullable(z.iso.datetime()),
	completedAt: z.nullable(z.iso.datetime()),
	...z.timestamps(),
	transaction: z.relation.one("transactionId", () => Transaction, "id"),
	theme: z.relation.one("themeId", () => CheckoutTheme, "id"),
});

export const CheckoutPage = checkoutPageTable.select;
export interface CheckoutPage extends z.infer<typeof CheckoutPage> {}
export const generateFakeCheckoutPage = zocker(CheckoutPage).generate;

export const CheckoutPageInsert = checkoutPageTable.insert;
export interface CheckoutPageInsert
	extends z.infer<typeof CheckoutPageInsert> {}
export const generateFakeCheckoutPageInsert =
	zocker(CheckoutPageInsert).generate;

export const CheckoutPageUpdate = checkoutPageTable.update;
export interface CheckoutPageUpdate
	extends z.infer<typeof CheckoutPageUpdate> {}
export const generateFakeCheckoutPageUpdate =
	zocker(CheckoutPageUpdate).generate;

export const CheckoutDisplayData = z.object({
	title: z.string(),
	description: z.nullable(z.string()),
	logo: z.nullable(z.lazy(() => CheckoutLogo)),
	colors: z.nullable(z.lazy(() => CheckoutColors)),
	items: z.array(z.lazy(() => CheckoutItem)),
	contact: z.nullable(z.lazy(() => CheckoutContact)),
	settings: z.nullable(z.lazy(() => CheckoutSettings)),
	customTexts: z.nullable(z.lazy(() => CheckoutCustomTexts)),
});
export type CheckoutDisplayData = z.infer<typeof CheckoutDisplayData>;

export const CheckoutLogo = z.object({
	url: z.string(),
	alt: z.nullable(z.string()),
	width: z.nullable(z.number()),
	height: z.nullable(z.number()),
});
export type CheckoutLogo = z.infer<typeof CheckoutLogo>;

export const CheckoutColors = z.object({
	primary: z.nullable(z.string()),
	secondary: z.nullable(z.string()),
	background: z.nullable(z.string()),
	text: z.nullable(z.string()),
	success: z.nullable(z.string()),
	error: z.nullable(z.string()),
});
export type CheckoutColors = z.infer<typeof CheckoutColors>;

export const CheckoutItem = z.object({
	name: z.string(),
	description: z.nullable(z.string()),
	quantity: z.number(),
	unitPrice: z.number(),
	imageUrl: z.nullable(z.string()),
});
export type CheckoutItem = z.infer<typeof CheckoutItem>;

export const CheckoutContact = z.object({
	supportEmail: z.nullable(z.string()),
	supportPhone: z.nullable(z.string()),
	website: z.nullable(z.string()),
});
export type CheckoutContact = z.infer<typeof CheckoutContact>;

export const CheckoutSettings = z.object({
	showItems: z.boolean(),
	showTotal: z.boolean(),
	showCurrency: z.boolean(),
	language: z.enum(["fr", "en", "es", "de"]),
	showPoweredBy: z.boolean(),
});
export type CheckoutSettings = z.infer<typeof CheckoutSettings>;

export const CheckoutCustomTexts = z.object({
	payButton: z.nullable(z.string()),
	cancelButton: z.nullable(z.string()),
	processingMessage: z.nullable(z.string()),
	successMessage: z.nullable(z.string()),
	errorMessage: z.nullable(z.string()),
});
export type CheckoutCustomTexts = z.infer<typeof CheckoutCustomTexts>;
