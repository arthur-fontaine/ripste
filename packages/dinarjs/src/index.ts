import { Decimal } from "decimal.js";

interface CurrencyProvider {
	getRates(base: string): Promise<Record<string, number>>;
	getSupportedCurrencies(): Promise<string[]>;
	getCurrencyDetails(currency: string): Promise<{
		maxDecimalPlaces: number;
	}>;
}

export class Dinar {
	#currencyProvider: CurrencyProvider;

	constructor(currencyProvider: CurrencyProvider) {
		this.#currencyProvider = currencyProvider;
	}

	async getCurrencies(): Promise<string[]> {
		return this.#currencyProvider.getSupportedCurrencies();
	}

	async convert(amount: number, from: string, to: string): Promise<number> {
		const rates = await this.#currencyProvider.getRates(from);
		const rateTo = rates[to];
		if (!rateTo) {
			throw new Error(`Unsupported currency: ${to}`);
		}
		const rateFrom = rates[from];
		if (!rateFrom) {
			throw new Error(`Unsupported currency: ${from}`);
		}
		const amountDecimal = new Decimal(amount);
		return amountDecimal.mul(rateTo).div(rateFrom).toNumber();
	}

	async isSupportedCurrency(currency: string): Promise<boolean> {
		const supportedCurrencies =
			await this.#currencyProvider.getSupportedCurrencies();
		return supportedCurrencies.includes(currency);
	}

	async assertValidAmount(amount: number, currency: string): Promise<true> {
		const currencyDetails =
			await this.#currencyProvider.getCurrencyDetails(currency);

		const amountDecimal = new Decimal(amount);
		if (!(
			amountDecimal.isFinite() &&
			amountDecimal.gte(0) &&
			amountDecimal.decimalPlaces() <= currencyDetails.maxDecimalPlaces
		)) {
			throw new Dinar.InvalidAmountError(
				amount,
				currency,
				currencyDetails.maxDecimalPlaces,
			);
		}

		return true;
	}

	static InvalidAmountError = class InvalidAmountError extends Error {
		amount: number;
		currency: string;
		expectedDecimalPlaces: number;

		constructor(amount: number, currency: string, expectedDecimalPlaces: number) {
			super(
				`Invalid amount for ${currency}: ${amount}. Must have at most ${expectedDecimalPlaces} decimal places.`,
			);
			this.name = "InvalidAmountError";
			this.amount = amount;
			this.currency = currency;
			this.expectedDecimalPlaces = expectedDecimalPlaces;
		}
	}
}
