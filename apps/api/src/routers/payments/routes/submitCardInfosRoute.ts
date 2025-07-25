import { vValidator } from "@hono/valibot-validator";
import { setTimeout } from "node:timers/promises";
import * as v from "valibot";
import { vValidatorThrower } from "../../../utils/v-validator-thrower.ts";
import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { createPspClient } from "@ripste/psp-api/client";
import { database } from "../../../database.ts";

const PSP_API_URL = process.env["PSP_API_URL"];
if (!PSP_API_URL) {
	throw new Error("PSP_API_URL environment variable is not set");
}
const pspClient = createPspClient(PSP_API_URL);

export const submitCardInfosRoute = createHonoRouter().post(
	"/",
	vValidator(
		"json",
		v.config(getSchema(), { abortEarly: true }),
		vValidatorThrower,
	),
	vValidator("query", v.object({ uri: v.string() }), vValidatorThrower),
	async (c) => {
		const uri = c.req.valid("query").uri;
		const { provider, cardNumber, cvv, month, year, holderName } =
			c.req.valid("json");

		const [checkoutPage] = await database.checkoutPage.findMany({ uri });
		if (!checkoutPage) {
			return c.json({ error: "Checkout page not found." }, 404);
		}

		const transaction = checkoutPage.transaction;

		const onSuccess = async () => {
			await database.checkoutPage.update(checkoutPage.id, {
				completedAt: new Date(),
			});
		};

		const onError = async () => {};

		const paymentRes = await pspClient.stub.payments.$post({
			json: {
				amount: transaction.amount,
				currency: transaction.currency,
				paymentMethod: {
					type: provider,
					cardNumber,
					expiryDate: `${month}/${year}`,
					cvv: cvv.toString(),
					holderName,
				},
			},
		});
		const paymentResult = await paymentRes.json();

		let tryCount = 0;
		const maxRetries = 20;
		while (true) {
			tryCount++;
			if (tryCount > maxRetries) {
				await onError();
				return c.json({ error: "Payment processing timed out." }, 408);
			}

			await setTimeout(1000);

			const statusRes = await pspClient.stub.payments[":id"].status.$get({
				param: { id: paymentResult.id },
			});

			if (!statusRes.ok) {
				console.error(`Error fetching payment status: ${statusRes.status} ${statusRes.statusText} ${await statusRes.text()}`);
				continue; // Retry fetching status
			}

			const status = await statusRes.json();

			if (status.status === "waiting") continue;

			if (status.status === "success") {
				await onSuccess();
				return c.json({ success: true });
			}
			if (status.status === "failure") {
				await onError();
				return c.json(
					{
						error: "Payment failed.",
						reason: status.error,
					},
					400,
				);
			}
		}
	},
);

function getSchema() {
	return v.object({
		provider: v.picklist(["mastercard", "visa", "amex"]),
		holderName: v.string(),
		cardNumber: v.string(),
		cvv: v.pipe(
			v.string(),
			v.minLength(3),
			v.maxLength(4),
			v.transform(Number),
			v.number(),
		),
		year: v.number(),
		month: v.number(),
	});
}
