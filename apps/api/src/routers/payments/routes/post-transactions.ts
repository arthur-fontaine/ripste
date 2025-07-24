import { vValidator } from "@hono/valibot-validator";
import { Dinar } from "@ripste/dinar.js";
import * as v from "valibot";
import { vValidatorThrower } from "../../../utils/v-validator-thrower.ts";
import { dinar } from "../../../utils/dinar.ts";
import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { storeRouteMiddleware } from "../../../middlewares/storeRouteMiddleware.ts";
import { randomUUID } from "node:crypto";

export const postTransactionsRoute = createHonoRouter().post(
	"/",
	vValidator(
		"json",
		v.config(getSchema(), { abortEarly: true }),
		vValidatorThrower,
	),
	protectedRouteMiddleware,
	storeRouteMiddleware,
	async (c) => {
		const {
			amount,
			currency,
			reference,
			metadata,
			expiresAt,
			checkoutPage: { themeId, ...checkoutPage },
		} = c.req.valid("json");

		const [theme] = await database.checkoutTheme.findMany({
			store: { id: c.get("store").id },
			id: themeId,
		});
		if (!theme) return c.json({ error: "Theme not found." }, 404);

		const transaction = await database.transaction.insert({
			amount,
			currency,
			reference,
			status: "created",
			methodType: "checkout_page",
			metadata: metadata ?? null,
			storeId: c.get("store").id,
			sessionId: c.get("session").id,
		});

		await database.transactionEvent.insert({
			transactionId: transaction.id,
			eventData: { type: "transaction_created" },
		});

		const uri = randomUUID();

		await database.checkoutPage.insert({
			accessedAt: null,
			completedAt: null,
			displayData: checkoutPage,
			expiresAt,
			redirectCancelUrl: null,
			redirectSuccessUrl: null,
			themeId: theme.id,
			transactionId: transaction.id,
			uri,
		});

		c.header("Location", `/transactions/${transaction.id}`);

		return c.json(
			{
				data: { id: transaction.id, uri },
			},
			201,
		);
	},
);

function getSchema() {
	const EURO_LIMIT = 1_000_000;
	const FORMATTED_EURO_LIMIT = `${EURO_LIMIT.toLocaleString("en-US")}€`;

	const baseSchema = v.objectAsync({
		amount: v.number(),
		currency: v.pipe(v.string(), v.toUpperCase()),
		reference: v.string(),
		metadata: v.optional(v.nullable(v.record(v.string(), v.string()))),
		expiresAt: v.optional(
			v.nullable(
				v.pipe(
					v.string(),
					v.transform((date) => new Date(date)),
					v.date(),
				),
			),
			null,
		),
		checkoutPage: v.object({
			title: v.string(),
			themeId: v.string(),
			description: v.optional(v.nullable(v.string()), null),
			logo: v.optional(
				v.nullable(
					v.object({
						url: v.string(),
						alt: v.optional(v.nullable(v.string()), null),
						width: v.optional(v.nullable(v.number()), null),
						height: v.optional(v.nullable(v.number()), null),
					}),
				),
				null,
			),
			colors: v.optional(
				v.nullable(
					v.object({
						primary: v.optional(v.nullable(v.string()), null),
						secondary: v.optional(v.nullable(v.string()), null),
						background: v.optional(v.nullable(v.string()), null),
						text: v.optional(v.nullable(v.string()), null),
						success: v.optional(v.nullable(v.string()), null),
						error: v.optional(v.nullable(v.string()), null),
					}),
				),
				null,
			),
			items: v.optional(
				v.nullable(
					v.array(
						v.object({
							name: v.string(),
							description: v.optional(v.nullable(v.string()), null),
							quantity: v.number(),
							unitPrice: v.number(),
							imageUrl: v.optional(v.nullable(v.string()), null),
						}),
					),
				),
				null,
			),
			contact: v.optional(
				v.nullable(
					v.object({
						supportEmail: v.optional(v.nullable(v.string()), null),
						supportPhone: v.optional(v.nullable(v.string()), null),
						website: v.optional(v.nullable(v.string()), null),
					}),
				),
				null,
			),
			settings: v.optional(
				v.nullable(
					v.object({
						showItems: v.boolean(),
						showTotal: v.boolean(),
						showCurrency: v.boolean(),
						language: v.picklist(["fr", "en", "es", "de"]),
						showPoweredBy: v.boolean(),
					}),
				),
				null,
			),
			customTexts: v.optional(
				v.nullable(
					v.object({
						payButton: v.optional(v.nullable(v.string()), null),
						cancelButton: v.optional(v.nullable(v.string()), null),
						processingMessage: v.optional(v.nullable(v.string()), null),
						successMessage: v.optional(v.nullable(v.string()), null),
						errorMessage: v.optional(v.nullable(v.string()), null),
					}),
				),
				null,
			),
		}),
	});

	type Data = v.InferOutput<typeof baseSchema>;

	return v.pipeAsync(
		baseSchema,
		// Validate
		v.check(amountIsPositive, "Amount must be a positive number."),
		v.check(
			isNotCryptocurrency,
			"Cryptocurrency payments are not yet supported.",
		),
		v.checkAsync(isSupportedCurrency, "Unsupported currency."),
		v.checkAsync(
			euroEquivalentNotExceedingLimit,
			`Amount must not exceed ${FORMATTED_EURO_LIMIT} or its equivalent in other currencies. Please contact support for larger transactions.`,
		),
		v.rawCheckAsync(async ({ dataset, addIssue }) => {
			// amountHasValidDecimalPlaces
			if (!dataset.typed && dataset.issues !== undefined) return;
			const result = await amountHasValidDecimalPlaces(dataset.value);
			if (typeof result === "string") addIssue({ message: result });
		}),
	);

	function amountIsPositive(data: Data) {
		return data.amount > 0;
	}

	function isNotCryptocurrency(data: Data) {
		return !["BTC", "ETH", "XRP", "SOL", "DOGE"].includes(data.currency);
	}

	function isSupportedCurrency(data: Data) {
		return dinar.isSupportedCurrency(data.currency);
	}

	async function euroEquivalentNotExceedingLimit(data: Data) {
		const euroEquivalent = await dinar.convert(
			data.amount,
			data.currency,
			"EUR",
		);
		return euroEquivalent <= EURO_LIMIT;
	}

	async function amountHasValidDecimalPlaces(data: Data) {
		try {
			await dinar.assertValidAmount(data.amount, data.currency);
			return true;
		} catch (error) {
			if (error instanceof Dinar.InvalidAmountError) {
				return `Amount must have at most ${error.expectedDecimalPlaces} decimal places for ${error.currency}.`;
			}
			throw error;
		}
	}
}
