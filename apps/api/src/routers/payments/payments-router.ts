import { Hono } from "hono";
import * as v from "valibot";
import { vValidator } from "@hono/valibot-validator";
import { Dinar } from "@ripste/dinar.js";
import currencyCodes from "currency-codes";

const dinar = new Dinar({
	async getRates(base) {
		const response = await fetch(
			`https://open.er-api.com/v6/latest?base=${base}`,
		);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch exchange rates for ${base}. Error: ${response.statusText}`,
			);
		}
		const data = (await response.json()) as { rates: Record<string, number> };
		return data.rates;
	},
	async getSupportedCurrencies() {
		const response = await fetch(
			"https://openexchangerates.org/api/currencies.json",
		);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch supported currencies. Error: ${response.statusText}`,
			);
		}
		const data = (await response.json()) as { [key: string]: string };
		return Object.keys(data);
	},
	async getCurrencyDetails(currency) {
		const currencyData = currencyCodes.code(currency);
		if (!currencyData) {
			throw new Error(`Unsupported currency: ${currency}`);
		}
		return {
			maxDecimalPlaces: currencyData.digits,
		};
	},
});

export const paymentsRouter = new Hono().post(
	"/transactions",
	vValidator(
		"json",
		v.config(
			v.pipeAsync(
				v.objectAsync({
					amount: v.pipe(
						v.number(),
						v.check((value) => value > 0, "Amount must be a positive number."),
					),
					currency: v.pipeAsync(
						v.string(),
						v.toUpperCase(),
						v.check(
							(value) => !["BTC", "ETH", "XRP", "SOL", "DOGE"].includes(value),
							"Cryptocurrency payments are not yet supported.",
						),
						v.checkAsync(
							dinar.isSupportedCurrency.bind(dinar),
							"Unsupported currency.",
						),
					),
				}),
				v.checkAsync(async (data) => {
					const euroEquivalent = await dinar.convert(
						data.amount,
						data.currency,
						"EUR",
					);
					return euroEquivalent <= 1000000;
				}, "Amount must not exceed 1,000,000€ or its equivalent in other currencies. Please contact support for larger transactions."),
				v.rawCheckAsync(
					async ({ dataset, addIssue }) => {
            const data = dataset.value as { amount: number; currency: string };
            try {
              await dinar.assertValidAmount(data.amount, data.currency);
            } catch (error) {
              if (error instanceof Dinar.InvalidAmountError) {
                addIssue({
                  message: `Amount must have at most ${error.expectedDecimalPlaces} decimal places for ${error.currency}.`,
                });
              } else {
                throw error; // Re-throw unexpected errors
              }
            }
          },
				),
			),
			{ abortEarly: true },
		),
		(result, c) => {
			if (!result.success) {
				return c.json(
					{
						error: result.issues.map((issue) => issue.message).join(", "),
					},
					{ status: 400 },
				);
			}
			return undefined;
		},
	),
	async (c) => {
		return c.json({});
	},
);
