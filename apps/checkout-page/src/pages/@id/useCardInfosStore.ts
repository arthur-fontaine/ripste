import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { apiClient } from "../../apiClient.ts";
import type { Data } from "./+data";
import { useData } from "vike-vue/useData";

export const useCardInfosStore = defineStore("cardInfos", () => {
	const data = useData<Data>();

	const holderName = ref("");
	const cardNumber = ref("");
	const month = ref("");
	const year = ref("");
	const cvv = ref("");

	const payResult = reactive({
		status: null as null | "success" | "error",
		message: null as null | string,
	});

	async function pay() {
		try {
			if (
				!holderName.value ||
				!cardNumber.value ||
				!month.value ||
				!year.value ||
				!cvv.value
			) {
				throw new Error("All fields are required");
			}

			const cardType = detectCardType(cardNumber.value);

			const response = await apiClient.payments["submit-card-infos"].$post({
				json: {
					provider: cardType,
					cardNumber: cardNumber.value,
					holderName: holderName.value,
					month: Number(month.value),
					year: Number(year.value),
					cvv: cvv.value,
				},
				param: {
					uri: data.uri,
				},
			});
			const result = await response.json();

			if ("error" in result) throw new Error(result.error);
			if (!result.success) throw new Error("Payment failed");

			payResult.status = "success";
		} catch (error) {
			payResult.status = "error";
			if (error instanceof Error) payResult.message = error.message;
			else payResult.message = "An unknown error occurred";
			console.error("Payment failed:", error);
		}
	}

	return { holderName, cardNumber, month, year, cvv, pay, payResult };
});

function detectCardType(number: string) {
	const cleaned = number.replace(/\D/g, "");

	if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleaned)) return "visa";
	if (
		/^5[1-5][0-9]{14}$/.test(cleaned) ||
		/^2(2[2-9]|[3-6][0-9]|7[01])[0-9]{12}$/.test(cleaned)
	)
		return "mastercard";
	if (/^3[47][0-9]{13}$/.test(cleaned)) return "amex";

	throw new Error("Unsupported card type");
}
