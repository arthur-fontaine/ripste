import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { interfaceToZod } from "interface-to-zod";

export interface IPspRouter {
	submitPayment(paymentInfos: IPaymentInfos): Promise<{ id: string }>;
	getPaymentStatus(
		id: string,
	): Promise<
		| { status: "waiting" }
		| { status: "success" }
		| { status: "failure"; error: string }
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
	return new Hono()
		.post(
			"/submit-payment",
			zValidator("json", PaymentInfosSchema),
			async (c) => {
				const paymentInfos = c.req.valid("json");
				const result = await psp.submitPayment(paymentInfos);
				return c.json({ id: result.id }, 201);
			},
		)
		.get("/payments/:id/status", async (c) => {
			const id = c.req.param("id");
			const result = await psp.getPaymentStatus(id);
			return c.json(result);
		});
}
