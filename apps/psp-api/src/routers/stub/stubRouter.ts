import { match, P } from "ts-pattern";
import { createPspRouter } from "../../utils/createPspRouter.ts";
import { setTimeout } from "node:timers/promises";

export const stubRouter = createPspRouter({
	async pay(paymentInfos) {
		const success = match([
			paymentInfos.paymentMethod.type,
			paymentInfos.paymentMethod.cardNumber.replace(/\s/g, ""),
		])
			.returnType<true | string>()
			.with(
				["visa", P.union("4242424242424242", "4000056655665556")],
				() => true,
			)
			.with(
				[
					"mastercard",
					P.union(
						"5555555555554444",
						"2223003122003222",
						"5200828282828210",
						"5105105105105100",
					),
				],
				() => true,
			)
			.with(["amex", P.union("378282246310005", "371449635398431")], () => true)
			.otherwise(() => "Invalid card number");

		if (success !== true) return { success: false, error: success };

		const timeout = Math.floor(Math.random() * 9000) + 1000;
		await setTimeout(timeout);

		return { success: true };
	},
});
