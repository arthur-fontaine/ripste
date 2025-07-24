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
	paymentMethod: ICardPaymentMethod;
}

interface ICardPaymentMethod {
	type: "mastercard" | "visa" | "amex";
	holderName: string;
	cardNumber: string;
	cvv: string;
	expiryDate: string;
}

const PaymentInfosSchema = interfaceToZod<IPaymentInfos>(
	"IPaymentInfos",
	__filename,
)
	.check((ctx) => {
		const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{4})$/;
		const expiryDate = ctx.value?.paymentMethod?.expiryDate;

		if (!expiryDate) {
			ctx.issues.push({
				code: "custom",
				message: "Expiry date is required",
				input: ctx.value.paymentMethod.expiryDate,
			});
			return;
		}

		const expiryDateMatch = expiryDate?.match(expiryDateRegex);
		if (!expiryDateMatch) {
			ctx.issues.push({
				code: "custom",
				message: "Expiry date must be in MM/YYYY format",
				input: ctx.value.paymentMethod.expiryDate,
			});
		}

		const month = Number.parseInt(expiryDateMatch?.[1] || "0", 10);
		const year = Number.parseInt(expiryDateMatch?.[2] || "0", 10);
		const date = new Date(`${year}-${month}-01`);

		if (date < new Date()) {
			ctx.issues.push({
				code: "custom",
				message: "Expiry date cannot be in the past",
				input: ctx.value.paymentMethod.expiryDate,
			});
		}
	})
	.check((ctx) => {
		if (!ctx.value?.paymentMethod?.cvv) {
			ctx.issues.push({
				code: "custom",
				message: "CVV is required",
				input: ctx.value.paymentMethod.cvv,
			});
		}

		if (!/^\d{3,4}$/.test(ctx.value.paymentMethod.cvv)) {
			ctx.issues.push({
				code: "custom",
				message: "CVV must be a 3 or 4 digit number",
				input: ctx.value.paymentMethod.cvv,
			});
		}
	});

export function createPspRouter(psp: IPspRouter) {
	return new Hono()
		.post("/payments", zValidator("json", PaymentInfosSchema), async (c) => {
			const paymentInfos = c.req.valid("json");
			const result = await psp.submitPayment(paymentInfos);
			return c.json({ id: result.id }, 201);
		})
		.get("/payments/:id/status", async (c) => {
			const id = c.req.param("id");
			const result = await psp.getPaymentStatus(id);
			return c.json(result);
		});
}
