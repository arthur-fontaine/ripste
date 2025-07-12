import { vValidator } from "@hono/valibot-validator";
import { Dinar } from "@ripste/dinar.js";
import * as v from "valibot";
import { vValidatorThrower } from "../../../utils/v-validator-thrower.ts";
import { dinar } from "../../../utils/dinar.ts";
import { createHonoRouter } from "../../../utils/create-hono-router.ts";

export const postTransactionsRoute = createHonoRouter().post(
	"/",
	vValidator(
		"json",
		v.config(getSchema(), { abortEarly: true }),
		vValidatorThrower,
	),
	async (c) => {
		return c.json({});
	},
);

function getSchema() {
	interface Data {
		amount: number;
		currency: string;
	}

	const EURO_LIMIT = 1_000_000;
	const FORMATTED_EURO_LIMIT = `${EURO_LIMIT.toLocaleString("en-US")}€`;

	const baseSchema = v.objectAsync({
		amount: v.number(),
		currency: v.pipe(v.string(), v.toUpperCase()),
	});

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
