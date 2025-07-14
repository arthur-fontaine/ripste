import { Dinar } from "@ripste/dinar.js";
import currencyCodes from "currency-codes";

async function getOpenExchangeRates(base: string) {
	const url = `https://open.er-api.com/v6/latest/${base}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch exchange rates for ${base}. Error: ${response.statusText}`,
		);
	}
	const data = (await response.json()) as { rates: Record<string, number> };
	return data.rates;
}

export const dinar = new Dinar({
	async getRates(base) {
		return getOpenExchangeRates(base);
	},
	async getSupportedCurrencies() {
		const rates = await getOpenExchangeRates("EUR");
		const supportedCurrencies = Object.keys(rates);
		return supportedCurrencies;
	},
	async getCurrencyDetails(currency) {
		const currencyData = currencyCodes.code(currency);
		if (!currencyData) throw new Error(`Unsupported currency: ${currency}`);
		return {
			maxDecimalPlaces: currencyData.digits,
		};
	},
});
