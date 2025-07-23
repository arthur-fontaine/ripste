import { match, P } from "ts-pattern";
import {
	createPspRouter,
	type IPspRouter,
} from "../../utils/createPspRouter.ts";
import { setTimeout } from "node:timers/promises";
import { randomUUID } from "node:crypto";
import { HTTPException } from "hono/http-exception";

class PaymentsDb {
	#paymentsMap = new Map<
		string,
		Awaited<ReturnType<IPspRouter["getPaymentStatus"]>>
	>();

	processPayment(
		id: string,
		promise: ReturnType<IPspRouter["getPaymentStatus"]>,
	) {
		this.#paymentsMap.set(id, { status: "waiting" });
		promise.then((result) => this.#paymentsMap.set(id, result));
	}

	getPaymentStatus(id: string) {
		return this.#paymentsMap.get(id);
	}
}
const paymentsDb = new PaymentsDb();

export const stubRouter = createPspRouter({
	async submitPayment(paymentInfos) {
		const id = randomUUID();

		paymentsDb.processPayment(
			id,
			(async () => {
				const timeout = Math.floor(Math.random() * 9000) + 1000;
				await setTimeout(timeout);

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
					.with(
						["amex", P.union("378282246310005", "371449635398431")],
						() => true,
					)
					.otherwise(() => "Invalid card number");

				if (success !== true) return { status: "failure", error: success };

				return { status: "success" };
			})(),
		);

		return { id };
	},
	async getPaymentStatus(id) {
		const paymentPromise = paymentsDb.getPaymentStatus(id);
		if (!paymentPromise) {
			throw new HTTPException(404, {
				message: `Payment with id ${id} not found`,
			});
		}

		return paymentPromise;
	},
});
