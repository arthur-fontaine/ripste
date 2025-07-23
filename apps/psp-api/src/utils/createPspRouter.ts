import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { interfaceToZod } from "interface-to-zod";

interface IPspRouter {
	pay(
		paymentInfos: IPaymentInfos,
	): Promise<
		{ success: true; error?: never } | { success: false; error: string }
	>;
}

interface IPaymentInfos {
	amount: number;
	currency: string;
	paymentMethod: IPaymentMethod;
}

type IPaymentMethod =
	| { type: "mastercard"; cardNumber: string }
	| { type: "visa"; cardNumber: string }
	| { type: "amex"; cardNumber: string };

const PaymentInfosSchema = interfaceToZod<IPaymentInfos>();

export function createPspRouter(psp: IPspRouter) {
	return new Hono().post(
		"/pay",
		zValidator("json", PaymentInfosSchema),
		async (c) => {
			const paymentInfos = c.req.valid("json");
			const result = await psp.pay(paymentInfos);
			if (!result.success) {
				return c.json({ error: result.error }, 400);
			}
			return c.json({ status: "success" });
		},
	);
}
